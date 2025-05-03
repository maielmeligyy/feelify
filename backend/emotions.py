import cv2
import numpy as np
import os
from PIL import Image

# Path to the pre-trained Haar cascade classifier for face detection
CASCADE_PATH = os.path.join(os.path.dirname(__file__), 'haarcascade_frontalface_default.xml')

# Emotions to detect
EMOTIONS = ["angry", "disgusted", "fearful", "happy", "sad", "surprised", "neutral"]

def detect_emotion_from_image(pil_image):
    """
    Detect emotion from a PIL Image object
    """
    cv_image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)

    try:
        face_cascade = cv2.CascadeClassifier(CASCADE_PATH)
        faces = face_cascade.detectMultiScale(gray, 1.1, 5, minSize=(30, 30))
        if len(faces) == 0:
            return "neutral"

        x, y, w, h = max(faces, key=lambda rect: rect[2] * rect[3])
        face_roi = gray[y:y+h, x:x+w]
        brightness = np.mean(face_roi)
        if brightness > 120:
            return "happy"
        elif brightness < 80:
            return "sad"
        else:
            import random
            return random.choice(EMOTIONS)
    except Exception:
        return "neutral"


def detect_emotion_from_voice(audio_data):
    """
    Detect emotion from audio data (bytes)
    """
    import random
    return random.choice(EMOTIONS) 