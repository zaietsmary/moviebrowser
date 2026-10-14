import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMovieDetails } from '../api';

export default function DetailsScreen({ route }) {
  const { movieID } = route.params;
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      const data = await getMovieDetails(movieID);
      setMovie(data);
      setLoading(false);
    };
    
    fetchDetails();
  }, [movieID]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!movie || movie.Response === "False") {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Не вдалося завантажити деталі фільму.</Text>
      </View>
    );
  }

  const posterUri = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster';

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: posterUri }} style={styles.poster} resizeMode="cover" />
      
      <View style={styles.content}>
        <Text style={styles.title}>{movie.Title}</Text>
        <Text style={styles.subtitle}>{movie.Year} • {movie.Genre} • {movie.Runtime}</Text>
        
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={20} color="#FFD700" style={{ marginRight: 5 }} />
          <Text style={styles.rating}>{movie.imdbRating}</Text>
          <Text style={styles.votes}>({movie.imdbVotes} голосів)</Text>
        </View>

        <Text style={styles.sectionTitle}>Сюжет</Text>
        <Text style={styles.text}>{movie.Plot}</Text>

        <Text style={styles.sectionTitle}>Режисер</Text>
        <Text style={styles.text}>{movie.Director}</Text>

        <Text style={styles.sectionTitle}>Актори</Text>
        <Text style={styles.text}>{movie.Actors}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  poster: {
    width: '100%',
    height: 400,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#eee',
  },
  rating: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  votes: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  }
});
