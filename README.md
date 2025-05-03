# Feelify - Emotion-Based Music Recommendation App

Feelify is a React Native app built with Expo that analyzes a user's emotions using facial expression analysis, voice analysis, and questionnaire responses to generate personalized Spotify playlist recommendations.

## Features

- 📹 Record video while answering emotional questions
- 🔍 Facial expression analysis to detect emotions
- 🎤 Voice analysis for emotion detection
- ⌚ Time-of-day awareness for context-appropriate recommendations
- 👥 Age-based personalization
- 🎵 Integration with Spotify for music recommendations
- 📱 Beautiful UI built with React Native and Expo

## Project Structure

The project is organized into two main directories:

- **feelify-app/**: The React Native mobile app built with Expo
- **backend/**: Flask backend for emotion detection and playlist generation

## Prerequisites

- Node.js 14+
- Yarn or npm
- Python 3.8+
- Expo CLI
- iOS simulator or actual iOS device with Expo Go installed
- macOS for iOS development (Xcode recommended)

## Installation and Setup

### Frontend (React Native app)

1. Navigate to the React Native app directory:
   ```bash
   cd feelify-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   
3. Start the Expo development server:
   ```bash
   npm start
   ```
   
4. Press `i` to open in iOS simulator, or scan the QR code with the Expo Go app on your iOS device.

### Backend (Flask API)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment (recommended):
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the Flask server:
   ```bash
   python app.py
   ```
   
5. The server will start at `http://127.0.0.1:5000`

## Running the App with Expo Go

1. Start the backend server following the instructions above
2. In the mobile app, update the API URL in `feelify-app/screens/QuestionnaireScreen.js` to point to your local machine's IP address (not localhost)
3. Start the Expo development server
4. Open Expo Go on your iOS device and scan the QR code
5. The app should connect to your local backend for emotion analysis and playlist generation

## Development Setup on macOS M1

For optimal development on macOS M1:

1. Install Xcode from the App Store
2. Install iOS simulators through Xcode
3. Use Rosetta 2 for any x86_64 dependencies that don't have ARM64 builds

## Note on APIs

This project includes a simulated Spotify integration. For a production version, you would need to:

1. Create a Spotify Developer account
2. Register your app for API access
3. Implement proper OAuth authentication
4. Update the backend to use the actual Spotify API

## License

MIT 