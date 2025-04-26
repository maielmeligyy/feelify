from flask import Flask, request, jsonify
from flask_cors import CORS
from emotion_detector import predict_emotion_from_base64, detect_emotion_from_audio
from emotions import get_spotify_playlist
import os
app = Flask(__name__)
CORS(app)
@app.route('/')
def home():
    return jsonify({"status": "Feelify backend is running!"})
@app.route('/detect-mood', methods=['POST'])
def detect_mood():
    try:
        image_base64 = request.form.get('image')
        mood_answers = request.form.get('moodAnswers')
        audio_file = request.files.get('audio')
        if not image_base64 or not audio_file:
            return jsonify({'error': 'Missing image or audio'}), 400
        face_emotion = predict_emotion_from_base64(image_base64) or "neutral"
        audio_path = "temp_audio.wav"
        audio_file.save(audio_path)
        voice_emotion = detect_emotion_from_audio(audio_path)
        if os.path.exists(audio_path):
            os.remove(audio_path)
        final_emotion = face_emotion
        if voice_emotion and voice_emotion != "neutral":
            final_emotion = voice_emotion  
        playlist = get_spotify_playlist(final_emotion, {})
        return jsonify({
            'detected_face_emotion': face_emotion,
            'detected_voice_emotion': voice_emotion,
            'final_mood': final_emotion,
            'playlist': playlist
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
