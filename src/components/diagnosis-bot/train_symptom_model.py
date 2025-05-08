# train_symptom_model.py
import pandas as pd
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.layers import TextVectorization
import numpy as np
from sklearn.utils.class_weight import compute_class_weight  # NEW
from tensorflow.keras.layers import MultiHeadAttention  # NEW
import json
from transformers import TFBertModel, BertTokenizer
from sklearn.model_selection import train_test_split
from collections import defaultdict
# Initialize Clinical BERT
bert_tokenizer = BertTokenizer.from_pretrained("emilyalsentzer/Bio_ClinicalBERT")
bert_model = TFBertModel.from_pretrained("emilyalsentzer/Bio_ClinicalBERT")

# Freeze BERT layers initially (we'll unfreeze later)
bert_model.trainable = False

def focal_loss(gamma=2.0, alpha=0.25):
    def loss(y_true, y_pred):
        y_true = tf.cast(y_true, tf.float32)
        ce = tf.keras.losses.sparse_categorical_crossentropy(y_true, y_pred, from_logits=False)
        pt = tf.exp(-ce)
        focal_loss = alpha * tf.pow(1 - pt, gamma) * ce
        return tf.reduce_mean(focal_loss)
    return loss


# Load and preprocess the dataset
def load_and_preprocess_data(filepath='symptoms.csv'):
    # Load the dataset
    df = pd.read_csv(filepath)
    
    # Get all symptom columns (all columns except first)
    symptom_columns = df.columns[1:]
    
    # Create mappings
    symptom_disease_map = defaultdict(list)
    disease_symptom_map = defaultdict(list)
    
    # Process each row
    for _, row in df.iterrows():
        # disease = row[0].strip().lower()
        # symptoms = []
        disease = row.iloc[0].strip().lower()  # FIXED: Use iloc
        symptoms = [s.strip().lower() for s in symptom_columns if row[s] == 1]
        
        # Check each symptom column

        # for symptom in symptom_columns:
        #     if row[symptom] == 1:
        #         symptom_clean = symptom.strip().lower()
        #         symptoms.append(symptom_clean)
        #         symptom_disease_map[symptom_clean].append(disease)
        
        # disease_symptom_map[disease] = symptoms
        for symptom in symptoms:
            symptom_disease_map[symptom].append(disease)
        disease_symptom_map[disease] = symptoms

    
    # Generate natural language examples
    training_examples = []
    for disease, symptoms in disease_symptom_map.items():
        # Create multiple phrasing variations for each symptom combination
        # In train_symptom_model.py - update the templates list
        templates = [
            # Basic symptom reporting
            "I have {symptoms}",
            "I'm experiencing {symptoms}",
            "My symptoms include {symptoms}",
            "I've been having {symptoms}",
            "{symptoms} - what could this be?",
            "Lately I've noticed {symptoms}",
            "For the past few days, {symptoms}",
            "I feel unwell with {symptoms}",
            
            # Duration-based
            "I've had {symptoms} for the past [number] days",
            "{symptoms} started [timeframe] ago",
            "Since [timeframe], I've been experiencing {symptoms}",
            "It's been about [number] hours/days/weeks with {symptoms}",
            
            # Severity descriptions
            "I have severe {symptoms}",
            "Mild {symptoms} that won't go away",
            "Extreme {symptoms} that's getting worse",
            "Moderate {symptoms} that comes and goes",
            
            # Contextual descriptions
            "When I [activity], I get {symptoms}",
            "{symptoms} appears after I [activity]",
            "My {symptoms} gets worse when [condition]",
            "The {symptoms} improves when [action]",
            
            # Comparative descriptions
            "This feels like {symptoms} but more intense",
            "Similar to last time I had [condition], but with {symptoms}",
            "Different from my usual [condition] because of {symptoms}",
            
            # Emotional context
            "I'm worried about these {symptoms}",
            "The {symptoms} is really bothering me",
            "I can't sleep because of {symptoms}",
            "My {symptoms} is affecting my daily life",
            
            # Combination patterns
            "Mainly {symptoms}, but also some [other symptoms]",
            "First I had [symptom], now I have {symptoms}",
            "Along with {symptoms}, I'm also experiencing [other symptoms]",
            
            # Time patterns
            "Morning {symptoms} that improves by afternoon",
            "Nighttime {symptoms} that keeps me awake",
            "The {symptoms} comes in waves throughout the day",
            
            # Location specific
            "The {symptoms} is focused on my [body part]",
            "My [body part] has {symptoms}",
            "The {symptoms} radiates to my [body part]",
            
            # Quality descriptions
            "A sharp {symptoms}",
            "Dull {symptoms} that persists",
            "Throbbing {symptoms}",
            "Intermittent {symptoms}",
            
            # Aggravating factors
            "{symptoms} gets worse when I [action]",
            "Nothing seems to relieve my {symptoms}",
            "The {symptoms} improves slightly with [remedy]",
            
            # Family history
            "I have {symptoms} and my family has history of [condition]",
            "Like my [relative], I'm experiencing {symptoms}",
            
            # Medication context
            "I've been taking [medication] and now have {symptoms}",
            "The {symptoms} started after I began [medication/treatment]",
            
            # Seasonal variations
            "Every [season] I get {symptoms}",
            "The {symptoms} appears during [weather condition]",
            
            # Comprehensive descriptions
            "For [timeframe] I've had {symptoms} that feels [description] and gets worse when [action]",
            "My main concern is {symptoms} which began [timeframe] and has been [improving/worsening] since then"
        ]

        
        # Create combinations of symptoms
        for i in range(1, min(5, len(symptoms)+1)):
            selected_symptoms = np.random.choice(symptoms, i, replace=False)
            
            for template in templates:
                if "{symptoms}" in template:
                    symptom_phrasing = ", ".join(selected_symptoms[:-1]) + (" and " + selected_symptoms[-1] if len(selected_symptoms) > 1 else selected_symptoms[-1])
                    example = template.format(symptoms=symptom_phrasing)
                    training_examples.append((example, disease))
                else:
                    training_examples.append((template, disease))
    
    return training_examples, symptom_disease_map, disease_symptom_map

# Prepare the training data
training_examples, symptom_disease_map, disease_symptom_map = load_and_preprocess_data()

# Split into texts and labels
texts = np.array([ex[0] for ex in training_examples])
labels = np.array([ex[1] for ex in training_examples])

# Tokenize text
vectorizer = layers.TextVectorization(
    max_tokens=5000,
    output_mode='int',
    output_sequence_length=20,
    ngrams=2  # Consider bigrams for better context
)
text_ds = tf.data.Dataset.from_tensor_slices(texts).batch(32)
vectorizer.adapt(text_ds)

# Encode labels
label_names = sorted(set(labels))
label_to_index = {label: idx for idx, label in enumerate(label_names)}
index_to_label = {idx: label for label, idx in label_to_index.items()}
y = np.array([label_to_index[label] for label in labels])

# Create training data tensors
X = vectorizer(np.array(texts))

# Split into train and validation
X_np = X.numpy() if hasattr(X, 'numpy') else np.array(X)
y_np = y.numpy() if hasattr(y, 'numpy') else np.array(y)

# Now split using sklearn
X_train, X_val, y_train, y_val = train_test_split(
    texts, #X_np
    y, #y_np
    test_size=0.2, 
    random_state=42
)
X_train = tf.convert_to_tensor(X_train)
X_val = tf.convert_to_tensor(X_val)
y_train = tf.convert_to_tensor(y_train)
y_val = tf.convert_to_tensor(y_val)

# NEW: Add class weights
class_weights = compute_class_weight('balanced', classes=np.unique(y), y=y)
class_weight_dict = dict(enumerate(class_weights))

# NEW: Convert to TensorFlow Dataset
train_ds = tf.data.Dataset.from_tensor_slices((X_train, y_train)).batch(32).prefetch(tf.data.AUTOTUNE)  # NEW
val_ds = tf.data.Dataset.from_tensor_slices((X_val, y_val)).batch(32).prefetch(tf.data.AUTOTUNE)  # NEW
# Build a more sophisticated model
# model = keras.Sequential([
#     layers.Embedding(input_dim=5000, output_dim=128),
#     layers.Bidirectional(layers.LSTM(64, return_sequences=True)),
#     layers.Bidirectional(layers.LSTM(32)),
#     layers.Dense(128, activation='relu'),
#     layers.Dropout(0.3),
#     layers.Dense(64, activation='relu'),
#     layers.Dropout(0.2),
#     layers.Dense(len(label_names), activation='softmax')
# ])
inputs = tf.keras.Input(shape=(1,), dtype=tf.string)
x = vectorizer(inputs)
x = layers.Embedding(input_dim=5000, output_dim=128)(x)

# Parallel processing paths
# path1 = layers.Bidirectional(layers.LSTM(64, return_sequences=True))(x)
# path2 = layers.GlobalMaxPooling1D()(x)
# path3 = layers.Conv1D(64, 3, activation='relu', padding='same')(x)
# path3 = layers.GlobalAvgPool1D()(path3)
# attention = layers.Attention()([x, x])  # Add after LSTM layer
# merged = layers.Concatenate()([path1, attention, path2, path3])
# # merged = layers.Concatenate()([path1, path2, path3])
# outputs = layers.Dense(len(label_names), activation='softmax')(merged)

# Parallel paths
# 1. BiLSTM Path
lstm = layers.Bidirectional(layers.LSTM(64, return_sequences=True))(x)
# 2. CNN Path
conv = layers.Conv1D(64, 3, activation='relu', padding='same')(x)
# 3. Attention Path
attention = MultiHeadAttention(num_heads=4, key_dim=64)(lstm, lstm)
    
    # Pooling and merge
merged = layers.Concatenate()([
        layers.GlobalMaxPooling1D()(lstm),
        layers.GlobalAveragePooling1D()(conv),
        layers.GlobalAveragePooling1D()(attention)
    ])
    
    # Classifier
outputs = layers.Dense(len(label_names), activation='softmax')(merged)

model = tf.keras.Model(inputs, outputs)

# model.compile(
#     loss='sparse_categorical_crossentropy',
#     optimizer=keras.optimizers.Adam(learning_rate=0.001),
#     metrics=['accuracy']
# )
lr_schedule = tf.keras.optimizers.schedules.ExponentialDecay(
    initial_learning_rate=1e-3,
    decay_steps=10000,
    decay_rate=0.9,
    staircase=True)

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=lr_schedule),
    loss=focal_loss(),
    metrics=['accuracy'])

# Add callbacks
callbacks = [
    keras.callbacks.EarlyStopping(patience=3, restore_best_weights=True),
    keras.callbacks.ModelCheckpoint('best_model.keras', save_best_only=True)
]

# Train model
# history = model.fit(
#     X_train, y_train,
#     validation_data=(X_val, y_val),
#     epochs=30,
#     batch_size=32,
#     callbacks=callbacks
# )
history = model.fit(
    train_ds,  # Using Dataset now
    validation_data=val_ds,
    epochs=10,
    callbacks=callbacks
)

# Save the final model
model.save("symptom_nlp_model.keras")

# Save additional metadata needed for the diagnostic flow
metadata = {
    'label_map': index_to_label,
    'symptom_disease_map': {k: list(v) for k, v in symptom_disease_map.items()},
    'disease_symptom_map': {k: list(v) for k, v in disease_symptom_map.items()},
    'vectorizer_config': vectorizer.get_config()
}

with open("diagnosis_metadata.json", "w") as f:
    json.dump(metadata, f)

print("Model and metadata saved successfully.")