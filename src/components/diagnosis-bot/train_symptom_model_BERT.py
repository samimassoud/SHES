# train_symptom_model.py
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

# Initialize Clinical BERT
bert_tokenizer = BertTokenizer.from_pretrained("emilyalsentzer/Bio_ClinicalBERT")
bert_model = TFBertModel.from_pretrained("emilyalsentzer/Bio_ClinicalBERT")
bert_model.trainable = False  # Freeze initially

def focal_loss(gamma=2.0, alpha=0.25):
    def loss(y_true, y_pred):
        y_true = tf.cast(y_true, tf.float32)
        ce = tf.keras.losses.sparse_categorical_crossentropy(y_true, y_pred, from_logits=False)
        pt = tf.exp(-ce)
        focal_loss = alpha * tf.pow(1 - pt, gamma) * ce
        return tf.reduce_mean(focal_loss)
    return loss

def load_and_preprocess_data(filepath='symptoms.csv'):
    df = pd.read_csv(filepath)
    symptom_columns = df.columns[1:]
    
    # Create mappings
    symptom_disease_map = defaultdict(list)
    disease_symptom_map = defaultdict(list)
    
    for _, row in df.iterrows():
        disease = row.iloc[0].strip().lower()
        symptoms = [s.strip().lower() for s in symptom_columns if row[s] == 1]
        
        for symptom in symptoms:
            symptom_disease_map[symptom].append(disease)
        disease_symptom_map[disease] = symptoms
    
    return df, symptom_disease_map, disease_symptom_map

# Load and prepare data
df, symptom_disease_map, disease_symptom_map = load_and_preprocess_data()

# Create label mappings
label_names = sorted(df.iloc[:, 0].str.strip().str.lower().unique())
label_to_index = {label: idx for idx, label in enumerate(label_names)}
index_to_label = {idx: label for label, idx in label_to_index.items()}

def create_bert_input(row):
    symptoms = [col for col in df.columns[1:] if row[col] == 1]
    return f"Patient presents with: {', '.join(symptoms)}"

text_inputs = df.apply(create_bert_input, axis=1)
labels = df.iloc[:, 0].str.strip().str.lower().map(label_to_index).values

def tokenize_texts(texts):
    return bert_tokenizer(
        texts.tolist(),
        padding='max_length',
        truncation=True,
        max_length=128,
        return_tensors='tf'
    )

bert_inputs = tokenize_texts(text_inputs)
symptoms_data = df.iloc[:, 1:].values.astype('float32')

# Split data
(train_idx, val_idx) = train_test_split(np.arange(len(labels)), test_size=0.2)

# Model architecture
num_symptoms = len(df.columns[1:])

class BertLayer(Layer):
    def __init__(self, bert_model, **kwargs):
        super().__init__(**kwargs)
        self.bert = bert_model

    def call(self, inputs):
        input_ids, attention_mask = inputs
        return self.bert(input_ids=input_ids, attention_mask=attention_mask)[1]

# Model architecture
text_input_ids = tf.keras.Input(shape=(128,), dtype=tf.int32, name='input_ids')
text_attention_mask = tf.keras.Input(shape=(128,), dtype=tf.int32, name='attention_mask')
symptom_input = tf.keras.Input(shape=(len(df.columns[1:]),), dtype=tf.float32, name='symptoms')

# BERT pathway (using our wrapper)
bert_output = BertLayer(bert_model)([text_input_ids, text_attention_mask])
bert_features = layers.Dense(256, activation='relu')(bert_output)

# Structured symptoms pathway
symptom_features = layers.Dense(128, activation='relu')(symptom_input)

# Combine pathways
combined = layers.Concatenate()([bert_features, symptom_features])
output = layers.Dense(len(label_names), activation='softmax')(combined)

model = tf.keras.Model(
    inputs=[text_input_ids, text_attention_mask, symptom_input],
    outputs=output
)

# Compile
lr_schedule = tf.keras.optimizers.schedules.ExponentialDecay(
    initial_learning_rate=1e-3,
    decay_steps=10000,
    decay_rate=0.9,
    staircase=True)

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=lr_schedule),
    loss=focal_loss(),
    metrics=['accuracy'])

# Create datasets
def create_dataset(indices):
    return tf.data.Dataset.from_tensor_slices(
        ({
            'input_ids': bert_inputs['input_ids'][indices],
            'attention_mask': bert_inputs['attention_mask'][indices],
            'symptoms': symptoms_data[indices]
        }, 
        labels[indices])
    ).batch(32).prefetch(tf.data.AUTOTUNE)

train_ds = create_dataset(train_idx)
val_ds = create_dataset(val_idx)

# Callbacks
callbacks = [
    keras.callbacks.EarlyStopping(patience=3, restore_best_weights=True),
    keras.callbacks.ModelCheckpoint('best_model_BERT.keras', save_best_only=True)
]

# Train
history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=10,
    callbacks=callbacks
)

# Save
model.save("symptom_nlp_bert_model.keras")

metadata = {
    'label_map': index_to_label,
    'symptom_disease_map': {k: list(v) for k, v in symptom_disease_map.items()},
    'disease_symptom_map': {k: list(v) for k, v in disease_symptom_map.items()},
    'num_symptoms': len(df.columns[1:])
}

with open("diagnosis_metadata.json", "w") as f:
    json.dump(metadata, f)

print("Model and metadata saved successfully.")