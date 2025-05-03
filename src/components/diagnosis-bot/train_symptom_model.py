import tensorflow as tf
import tensorflowjs as tfjs
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MultiLabelBinarizer
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
import numpy as np
import pickle

# Symptom data
texts = [
    "I have a high fever and chills",
    "There’s a persistent dry cough",
    "My head hurts with light sensitivity",
    "I feel chest tightness and dry cough",
    "I am experiencing fatigue and headache",
    "My body is hot and I have a temperature",
    "Dry coughing every few minutes",
    "Pain around my forehead and eyes",
    "Tight feeling in my chest",
    "Tired and slightly feverish"
]
labels = [
    ["fever"], ["cough"], ["headache"], ["cough"],
    ["fever", "headache"], ["fever"], ["cough"],
    ["headache"], ["cough"], ["fever"]
]

# Preprocessing
tokenizer = Tokenizer(num_words=1000, oov_token="<OOV>")
tokenizer.fit_on_texts(texts)
sequences = tokenizer.texts_to_sequences(texts)
padded = pad_sequences(sequences, maxlen=10)

mlb = MultiLabelBinarizer()
label_vecs = mlb.fit_transform(labels)

# Split
X_train, X_test, y_train, y_test = train_test_split(padded, label_vecs, test_size=0.2)

# Model
model = tf.keras.Sequential([
    tf.keras.layers.Embedding(1000, 16, input_length=10),
    tf.keras.layers.GlobalAveragePooling1D(),
    tf.keras.layers.Dense(24, activation='relu'),
    tf.keras.layers.Dense(len(mlb.classes_), activation='sigmoid')
])
model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
model.fit(X_train, y_train, epochs=40, validation_data=(X_test, y_test))

# Save
tfjs.converters.save_keras_model(model,"symptom_nlp_model")
with open("tokenizer.pkl", "wb") as f:
    pickle.dump(tokenizer, f)
with open("label_binarizer.pkl", "wb") as f:
    pickle.dump(mlb, f)
