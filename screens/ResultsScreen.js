import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';

const ResultsScreen = ({ route, navigation }) => {
  const { confirmedMood, playlist } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mood: {confirmedMood?.toUpperCase()}</Text>

      {playlist ? (
        <>
          <Image source={{ uri: playlist.image }} style={styles.image} />
          <Text style={styles.playlistName}>{playlist.name}</Text>
          <Text style={styles.artists}>Featuring: {playlist.artists}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => Linking.openURL(`https://open.spotify.com/playlist/${playlist.id}`)}
          >
            <Text style={styles.buttonText}>Open on Spotify</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.info}>No playlist data available</Text>
      )}

      <TouchableOpacity
        style={[styles.button, styles.restart]}
        onPress={() => navigation.replace('Welcome')}
      >
        <Text style={styles.buttonText}>Start Over</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResultsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B103E',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 24,
    fontWeight: '700',
  },
  image: {
    width: 240,
    height: 240,
    borderRadius: 16,
    marginBottom: 20,
  },
  playlistName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#eee',
    marginBottom: 8,
    textAlign: 'center',
  },
  artists: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#8e44ad',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 10,
  },
  restart: {
    backgroundColor: '#6c3483',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  info: {
    color: '#ccc',
    fontSize: 16,
    marginTop: 20,
  },
});
