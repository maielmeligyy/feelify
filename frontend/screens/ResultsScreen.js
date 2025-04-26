import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
export default function ResultsScreen({ route }) {
  const { mood, playlist } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mood detected: {mood}</Text>
      <Text style={styles.subheader}>Recommended Playlist 🎶</Text>
      <FlatList
        data={playlist?.tracks || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.trackContainer}>
            <Image source={{ uri: item.image }} style={styles.trackImage} />
            <View style={styles.trackInfo}>
              <Text style={styles.trackName}>{item.name}</Text>
              <Text style={styles.trackArtist}>{item.artist}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00C9A7',
    marginBottom: 20,
    textAlign: 'center',
  },
  subheader: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 30,
  },
  trackContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 10,
  },
  trackImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 10,
  },
  trackInfo: {
    flex: 1,
  },
  trackName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  trackArtist: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 2,
  },
});
