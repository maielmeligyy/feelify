from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import os
import numpy as np
import json
import random
import requests
from io import BytesIO
from PIL import Image
from emotion_detector import predict_emotion_from_base64
import speech_recognition as sr
from pydub import AudioSegment
from moviepy.editor import VideoFileClip
import tempfile
from textblob import TextBlob
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from dotenv import load_dotenv
from emotions import detect_emotion_from_image, detect_emotion_from_voice

app = Flask(__name__)
CORS(app)

# Load .env file for Spotify credentials
load_dotenv()

# Initialize Spotify client from environment variables
spotify_client_id = os.getenv("SPOTIPY_CLIENT_ID")
spotify_client_secret = os.getenv("SPOTIPY_CLIENT_SECRET")
if not spotify_client_id or not spotify_client_secret:
    raise RuntimeError("Missing SPOTIPY_CLIENT_ID or SPOTIPY_CLIENT_SECRET environment variable")
sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(
    client_id=spotify_client_id,
    client_secret=spotify_client_secret
))

@app.route('/api/analyze', methods=['POST'])
def analyze_emotions():
    try:
        data = request.json
        
        # Extract data from request
        base64_image = data.get('image', '')
        base64_audio = data.get('audio', '')
        age = data.get('age', '25')
        preferred_genre = data.get('preferredGenre', 'any')
        time_of_day = data.get('timeOfDay', 'afternoon')
        
        # Facial emotion detection using ML model
        if base64_image:
            facial = predict_emotion_from_base64(base64_image)
            if not facial:
                img_data = base64.b64decode(base64_image)
                img = Image.open(BytesIO(img_data))
                facial = detect_emotion_from_image(img)
        else:
            facial = 'neutral'
        
        # Voice emotion detection
        if base64_audio:
            # decode audio and save to temp file
            audio_bytes = base64.b64decode(base64_audio)
            with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as tmp:
                tmp.write(audio_bytes)
                tmp_path = tmp.name
            # convert to wav for processing (attempt with pydub, fallback to moviepy)
            wav_path = tmp_path + '.wav'
            try:
                AudioSegment.from_file(tmp_path).export(wav_path, format='wav')
            except Exception as e:
                print(f"⚠️ pydub extraction failed: {e}, attempting moviepy")
                try:
                    clip = VideoFileClip(tmp_path)
                    clip.audio.write_audiofile(wav_path)
                    clip.close()
                except Exception as e2:
                    raise RuntimeError(f"Failed to extract audio track: {e2}")
            # emotion detection from voice bytes
            with open(wav_path, 'rb') as f:
                audio_bytes = f.read()
            voice = detect_emotion_from_voice(audio_bytes)
            # speech-to-text transcription
            r = sr.Recognizer()
            with sr.AudioFile(wav_path) as source:
                audio = r.record(source)
            try:
                text = r.recognize_google(audio)
            except:
                text = ''
            sentiment = TextBlob(text).sentiment.polarity
            text_emotion = 'happy' if sentiment>0.1 else 'sad' if sentiment< -0.1 else 'neutral'
        else:
            voice = text_emotion = 'neutral'
        
        # Combine emotions (majority vote)
        votes = [facial, voice, text_emotion]
        from collections import Counter
        final_emotion = Counter(votes).most_common(1)[0][0]
        # Fetch playlist from Spotify
        playlist = get_spotify_playlist(final_emotion, preferred_genre)
        
        return jsonify({
            "success": True,
            "emotion": final_emotion,
            "playlist": playlist
        })
    
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

def get_spotify_playlist(emotion, genre):
    # Use Spotify recommendations
    try:
        seed_genres = [genre] if genre and genre!='any' else ['pop']
        rec = sp.recommendations(seed_genres=seed_genres, limit=10)
        tracks = rec['tracks']
        return {'name':f'{emotion.capitalize()} Mix', 'description':f'{emotion.capitalize()} vibes',
                'tracks':[{'name':t['name'],'artist':t['artists'][0]['name']} for t in tracks]}
    except Exception:
        return generate_playlist(emotion)

def generate_playlist(emotion):
    """
    Generate a playlist based on the detected emotion
    """
    # This is a simplified implementation
    # In a production app, you would integrate with the Spotify API
    
    # Map emotions to playlist themes
    emotion_playlists = {
        "happy": {
            "name": "Happy Vibes",
            "description": "Songs to amplify your happy mood",
            "tracks": [
                {"name": "Happy", "artist": "Pharrell Williams"},
                {"name": "Good as Hell", "artist": "Lizzo"},
                {"name": "Walking on Sunshine", "artist": "Katrina & The Waves"},
                {"name": "Can't Stop the Feeling!", "artist": "Justin Timberlake"},
                {"name": "Uptown Funk", "artist": "Mark Ronson ft. Bruno Mars"}
            ]
        },
        "sad": {
            "name": "Comforting Melodies",
            "description": "Music to embrace and process your emotions",
            "tracks": [
                {"name": "Someone Like You", "artist": "Adele"},
                {"name": "Fix You", "artist": "Coldplay"},
                {"name": "Skinny Love", "artist": "Bon Iver"},
                {"name": "All I Want", "artist": "Kodaline"},
                {"name": "The Night We Met", "artist": "Lord Huron"}
            ]
        },
        "angry": {
            "name": "Release the Tension",
            "description": "Powerful tracks to channel your energy",
            "tracks": [
                {"name": "Break Stuff", "artist": "Limp Bizkit"},
                {"name": "Given Up", "artist": "Linkin Park"},
                {"name": "Killing In The Name", "artist": "Rage Against The Machine"},
                {"name": "Bulls On Parade", "artist": "Rage Against The Machine"},
                {"name": "Sabotage", "artist": "Beastie Boys"}
            ]
        },
        "surprised": {
            "name": "Unexpected Discoveries",
            "description": "Surprising and fresh tracks to match your mood",
            "tracks": [
                {"name": "Midnight City", "artist": "M83"},
                {"name": "Feel Good Inc", "artist": "Gorillaz"},
                {"name": "Electric Feel", "artist": "MGMT"},
                {"name": "Take Me Out", "artist": "Franz Ferdinand"},
                {"name": "Paranoid Android", "artist": "Radiohead"}
            ]
        },
        "fearful": {
            "name": "Calm and Reassuring",
            "description": "Soothing tracks to ease anxiety",
            "tracks": [
                {"name": "Weightless", "artist": "Marconi Union"},
                {"name": "Gymnopédie No. 1", "artist": "Erik Satie"},
                {"name": "Breathe Me", "artist": "Sia"},
                {"name": "Comptine d'un autre été", "artist": "Yann Tiersen"},
                {"name": "Claire de Lune", "artist": "Claude Debussy"}
            ]
        },
        "disgusted": {
            "name": "Mood Lifters",
            "description": "Tracks to shift your mood",
            "tracks": [
                {"name": "Don't Stop Me Now", "artist": "Queen"},
                {"name": "September", "artist": "Earth, Wind & Fire"},
                {"name": "Hey Ya!", "artist": "Outkast"},
                {"name": "I Wanna Dance With Somebody", "artist": "Whitney Houston"},
                {"name": "Dancing Queen", "artist": "ABBA"}
            ]
        },
        "neutral": {
            "name": "Balanced Mix",
            "description": "A well-rounded playlist for your neutral mood",
            "tracks": [
                {"name": "Dreams", "artist": "Fleetwood Mac"},
                {"name": "Redbone", "artist": "Childish Gambino"},
                {"name": "Holocene", "artist": "Bon Iver"},
                {"name": "Californication", "artist": "Red Hot Chili Peppers"},
                {"name": "Creep", "artist": "Radiohead"}
            ]
        }
    }
    
    return emotion_playlists.get(emotion, emotion_playlists["neutral"])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
