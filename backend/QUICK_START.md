# Feelify Backend Quick Start Guide

This guide will help you quickly set up and run the Feelify backend server on your MacBook Pro M1.

## Requirements

- Python 3.8 or higher
- pip (Python package manager)
- OpenCV dependencies

## Setup Steps

1. **Create a virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the server**:
   ```bash
   python app.py
   ```

4. The server will start running at `http://127.0.0.1:5000`.

## API Endpoints

The backend exposes the following API endpoint:

### `POST /api/analyze`

Analyzes an image and audio for emotion detection and generates a playlist recommendation.

**Request Body**:
```json
{
  "image": "base64_encoded_image",
  "audio": "base64_encoded_audio",
  "age": "25",
  "preferredGenre": "rock",
  "timeOfDay": "evening"
}
```

**Response**:
```json
{
  "success": true,
  "emotion": "happy",
  "playlist": {
    "name": "Happy Vibes",
    "description": "Songs to amplify your happy mood",
    "tracks": [
      {"name": "Happy", "artist": "Pharrell Williams"},
      {"name": "Good as Hell", "artist": "Lizzo"},
      {"name": "Walking on Sunshine", "artist": "Katrina & The Waves"},
      {"name": "Can't Stop the Feeling!", "artist": "Justin Timberlake"},
      {"name": "Uptown Funk", "artist": "Mark Ronson ft. Bruno Mars"}
    ]
  }
}
```

## Testing Locally

You can test the API using curl:

```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"image":"base64string","audio":"base64string","age":"25","preferredGenre":"rock","timeOfDay":"evening"}'
```

Or use a tool like Postman for a more user-friendly interface.

## Troubleshooting

- **OpenCV installation issues on M1**: If you encounter issues installing OpenCV, try:
  ```bash
  pip install opencv-python-headless
  ```

- **Port already in use**: If port 5000 is already in use, you can change the port in `app.py` by modifying the line:
  ```python
  app.run(host='0.0.0.0', port=5000, debug=True)
  ```

- **Face detection issues**: Make sure the `haarcascade_frontalface_default.xml` file is in the same directory as the `emotions.py` file.

## Notes

- This backend uses simulated emotion detection for demonstration purposes.
- In a production environment, you would integrate with real ML models for emotion detection.
- The Spotify integration is simulated; a real app would need to use the Spotify API with proper authentication. 