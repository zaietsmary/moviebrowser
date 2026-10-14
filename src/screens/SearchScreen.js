import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { searchMovies } from '../api';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setPage(1); 
    
    const data = await searchMovies(query, 1);
    
    if (data.Response === "True") {
      setMovies(data.Search);
      setHasMore(data.Search.length < parseInt(data.totalResults));
    } else {
      setMovies([]);
      setError(data.Error); 
    }
    setLoading(false);
  };

  const loadMore = async () => {
    if (loading || !hasMore) return;
    
    const nextPage = page + 1;
    setPage(nextPage);
    
    const data = await searchMovies(query, nextPage);
    
    if (data.Response === "True") {
      setMovies(prev => [...prev, ...data.Search]);
      setHasMore((movies.length + data.Search.length) < parseInt(data.totalResults));
    }
  };

  const renderMovie = ({ item }) => {
    const posterUri = item.Poster !== 'N/A' ? item.Poster : 'https://via.placeholder.com/80x120?text=No+Poster';
    return (
      <TouchableOpacity 
        style={styles.movieCard} 
        onPress={() => navigation.navigate('Details', { movieID: item.imdbID })}
      >
        <Image source={{ uri: posterUri }} style={styles.poster} />
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{item.Title}</Text>
          <Text style={styles.year}>{item.Year} • {item.Type}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Назва фільму (англ)..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <Button title="Шукати" onPress={handleSearch} />
      </View>
      
      {loading && page === 1 ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item, index) => `${item.imdbID}-${index}`}
          renderItem={renderMovie}
          contentContainerStyle={styles.list}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && page > 1 ? <ActivityIndicator size="small" color="#0000ff" style={{ margin: 10 }} /> : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  list: {
    padding: 10,
  },
  movieCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  poster: {
    width: 80,
    height: 120,
    backgroundColor: '#eee',
  },
  infoContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  year: {
    fontSize: 14,
    color: '#666',
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  }
});
