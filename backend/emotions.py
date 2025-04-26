import os
from spotipy import Spotify
from spotipy.oauth2 import SpotifyClientCredentials
from dotenv import load_dotenv
load_dotenv()
client_id = os.getenv("6226b444856047c693761e8a2c649b3e")
client_secret = os.getenv("4dad333da2c841cdb190610f2487edb0")
spotify = Spotify(auth_manager=SpotifyClientCredentials(
    client_id=client_id,
    client_secret=client_secret
))
playlist_ids = {
    'happy': '37i9dQZF1DXdPec7aLTmlC',
    'sad': '37i9dQZF1DX7qK8ma5wgG1',
    'angry': '37i9dQZF1DWYMvTygsLWlG',
    'surprise': '37i9dQZF1DWXIcbzpLauPS',
    'neutral': '37i9dQZF1DX4sWSpwq3LiO',
}
def get_spotify_playlist(emotion, mood_answers=None):
    emotion = emotion.lower()
    playlist_id = playlist_ids.get(emotion, playlist_ids['neutral'])
    try:
        playlist = spotify.playlist(playlist_id)
        return {
            "id": playlist['id'],
            "name": playlist['name'],
            "image": playlist['images'][0]['url'],
            "tracks_total": playlist['tracks']['total'],
            "url": playlist['external_urls']['spotify'],
            "owner": playlist['owner']['display_name'],
            "description": playlist.get('description', '')
        }
    except Exception as e:
        return {
            "id": playlist_id,
            "name": f"{emotion.title()} Playlist",
            "image": None,
            "tracks_total": 0,
            "url": f"https://open.spotify.com/playlist/{playlist_id}",
            "owner": "Spotify",
            "description": "Default playlist (Spotify fallback)"
        }
