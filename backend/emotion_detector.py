import cv2
import numpy as np
import base64
# pyright: reportMissingImports=false
from tensorflow.keras.models import load_model
from PIL import Image
from io import BytesIO
import os

# Emotion labels
emotions = ['angry', 'happy', 'neutral', 'sad', 'surprise']

# Load Haar cascade and model
face_cascade = cv2.CascadeClassifier(os.path.join(os.path.dirname(__file__), "haarcascade_frontalface_default.xml"))
model = load_model(os.path.join(os.path.dirname(__file__), "ai_model/5-emo-70.h5"))

# === Extract + preprocess face from base64 image ===
def preprocess_base64_image(base64_image):
    try:
        decoded = base64.b64decode(base64_image)
        image = Image.open(BytesIO(decoded)).convert('L')  # grayscale
        img_array = np.array(image)

        faces = face_cascade.detectMultiScale(img_array, 1.3, 5)
        for (x, y, w, h) in faces:
            face = img_array[y:y+h, x:x+w]
            face = cv2.resize(face, (48, 48))
            face = face.astype("float32") / 255.0
            face = np.reshape(face, (1, 48, 48, 1))
            return face
    except Exception as e:
        print(f"❌ Face preprocessing error: {e}")
    return None

# === Predict emotion from base64 image ===
def predict_emotion_from_base64(base64_image):
    face = preprocess_base64_image(base64_image)
    if face is not None:
        preds = model.predict(face)[0]
        return emotions[np.argmax(preds)]
    return None 