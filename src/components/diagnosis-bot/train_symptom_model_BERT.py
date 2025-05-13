import pandas as pd
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np
from sklearn.utils.class_weight import compute_class_weight
from tensorflow.keras.layers import Layer
import json
from transformers import TFBertModel, BertTokenizer
from sklearn.model_selection import train_test_split
from collections import defaultdict
import os
import time
import logging

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Set cache directory
CACHE_DIR = "./bert_cache"
os.makedirs(CACHE_DIR, exist_ok=True)

try:
    logger.info("Loading Bio_ClinicalBERT tokenizer and model...")
    start_time = time.time()
    
    # Load tokenizer with explicit config
    bert_tokenizer = BertTokenizer.from_pretrained(
        "emilyalsentzer/Bio_ClinicalBERT",
        cache_dir=CACHE_DIR,
        local_files_only=False  # Force download if not available locally
    )
    
    # Load model
    bert_model = TFBertModel.from_pretrained(
        "emilyalsentzer/Bio_ClinicalBERT",
        cache_dir=CACHE_DIR,
        local_files_only=False
    )
    bert_model.trainable = False
    
    logger.info(f"BERT loaded successfully in {time.time() - start_time:.2f}s")
except Exception as e:
    logger.error(f"Failed to load BERT model: {str(e)}")
    logger.info("Trying to load with alternative method...")
    
    # Alternative loading method
    try:
        from transformers import AutoTokenizer, TFAutoModel
        
        bert_tokenizer = AutoTokenizer.from_pretrained(
            "emilyalsentzer/Bio_ClinicalBERT",
            cache_dir=CACHE_DIR
        )
        bert_model = TFAutoModel.from_pretrained(
            "emilyalsentzer/Bio_ClinicalBERT",
            cache_dir=CACHE_DIR
        )
        bert_model.trainable = False
        logger.info("Successfully loaded using AutoTokenizer/TFAutoModel")
    except Exception as alt_e:
        logger.error(f"Alternative loading failed: {str(alt_e)}")
        raise RuntimeError("Could not load BERT model. Check internet connection or try different model.")

def focal_loss(gamma=2.0, alpha=0.25):
    def loss(y_true, y_pred):
        y_true = tf.cast(y_true, tf.float32)
        ce = tf.keras.losses.sparse_categorical_crossentropy(y_true, y_pred, from_logits=False)
        pt = tf.exp(-ce)
        focal_loss = alpha * tf.pow(1 - pt, gamma) * ce
        return tf.reduce_mean(focal_loss)
    return loss

def load_and_preprocess_data(filepath='symptoms.csv'):
    try:
        logger.info("Loading dataset...")
        df = pd.read_csv(filepath)
        
        # Clean disease names
        df.iloc[:, 0] = df.iloc[:, 0].str.strip().str.lower()
        
        # Create mappings
        symptom_disease_map = defaultdict(list)
        disease_symptom_map = defaultdict(list)
        
        logger.info("Creating symptom mappings...")
        for _, row in df.iterrows():
            disease = row.iloc[0]
            symptoms = [col.strip().lower() for col in df.columns[1:] if row[col] == 1]
            
            for symptom in symptoms:
                symptom_disease_map[symptom].append(disease)
            disease_symptom_map[disease] = symptoms
        
        return df, symptom_disease_map, disease_symptom_map
    except Exception as e:
        logger.error(f"Error loading data: {str(e)}")
        raise

class BertLayer(Layer):
    def __init__(self, bert_model, **kwargs):
        super().__init__(**kwargs)
        self.bert = bert_model

    def call(self, inputs):
        input_ids, attention_mask = inputs
        return self.bert(input_ids=input_ids, attention_mask=attention_mask)[1]

def create_bert_input(row):
    symptoms = [col for col in df.columns[1:] if row[col] == 1]
    return f"Patient presents with: {', '.join(symptoms)}"

def tokenize_texts(texts):
    return bert_tokenizer(
        texts.tolist(),
        padding='max_length',
        truncation=True,
        max_length=128,
        return_tensors='tf'
    )

# Main execution
try:
    logger.info("Starting model training pipeline...")
    start_time = time.time()

    # Load and prepare data
    df, symptom_disease_map, disease_symptom_map = load_and_preprocess_data()

    # Create label mappings
    label_names = sorted(df.iloc[:, 0].unique())
    label_to_index = {label: idx for idx, label in enumerate(label_names)}
    index_to_label = {idx: label for label, idx in label_to_index.items()}

    # Prepare inputs
    text_inputs = df.apply(create_bert_input, axis=1)
    labels = df.iloc[:, 0].map(label_to_index).values
    bert_inputs = tokenize_texts(text_inputs)
    symptoms_data = df.iloc[:, 1:].values.astype('float32')

    # Split data - convert to TensorFlow tensors immediately
    train_idx, val_idx = train_test_split(np.arange(len(labels)), test_size=0.2, random_state=42)
    train_idx = tf.convert_to_tensor(train_idx, dtype=tf.int32)
    val_idx = tf.convert_to_tensor(val_idx, dtype=tf.int32)

    # Model architecture
    text_input_ids = tf.keras.Input(shape=(128,), dtype=tf.int32, name='input_ids')
    text_attention_mask = tf.keras.Input(shape=(128,), dtype=tf.int32, name='attention_mask')
    symptom_input = tf.keras.Input(shape=(len(df.columns[1:]),), dtype=tf.float32, name='symptoms')

    # BERT pathway
    bert_output = BertLayer(bert_model)([text_input_ids, text_attention_mask])
    bert_features = layers.Dense(256, activation='relu')(bert_output)

    # Symptoms pathway
    symptom_features = layers.Dense(128, activation='relu')(symptom_input)

    # Combine pathways
    combined = layers.Concatenate()([bert_features, symptom_features])
    output = layers.Dense(len(label_names), activation='softmax')(combined)

    model = tf.keras.Model(
        inputs=[text_input_ids, text_attention_mask, symptom_input],
        outputs=output
    )

    # Compile model
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=3e-4),
        loss=focal_loss(),
        metrics=['accuracy']
    )

    # Create datasets
    def create_dataset(indices):
        return tf.data.Dataset.from_tensor_slices(
            ({
                'input_ids': tf.gather(bert_inputs['input_ids'], indices),
                'attention_mask': tf.gather(bert_inputs['attention_mask'], indices),
                'symptoms': tf.gather(symptoms_data, indices)
            }, 
            tf.gather(labels, indices))
        ).batch(32).prefetch(tf.data.AUTOTUNE)

    train_ds = create_dataset(train_idx)
    val_ds = create_dataset(val_idx)

    # Callbacks
    callbacks = [
        keras.callbacks.EarlyStopping(patience=3, restore_best_weights=True),
        keras.callbacks.ModelCheckpoint('best_model_BERT_Finale.keras', save_best_only=True)
    ]

    # Train
    logger.info("Starting training...")
    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=10,
        callbacks=callbacks,
        verbose=1
    )

    # Save
    model.save("symptom_nlp_bert_model_finale.keras")

    metadata = {
        'label_map': index_to_label,
        'symptom_disease_map': {k: list(v) for k, v in symptom_disease_map.items()},
        'disease_symptom_map': {k: list(v) for k, v in disease_symptom_map.items()},
        'num_symptoms': len(df.columns[1:])
    }

    with open("diagnosis_metadata_finale.json", "w") as f:
        json.dump(metadata, f)

    logger.info(f"Pipeline completed in {(time.time() - start_time)/60:.2f} minutes")
    logger.info("Model and metadata saved successfully.")

except Exception as e:
    logger.error(f"Error in main execution: {str(e)}")
    raise