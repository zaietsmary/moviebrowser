const API_KEY = process.env.EXPO_PUBLIC_OMDB_API_KEY;

const BASE_URL = 'https://www.omdbapi.com/';

export const searchMovies = async (query, page = 1) => {
  try {
    const response = await fetch(`${BASE_URL}?s=${encodeURIComponent(query)}&page=${page}&apikey=${API_KEY}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Помилка при пошуку фільмів:", error);
    return { Response: "False", Error: "Network error" };
  }
};

export const getMovieDetails = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}?i=${id}&plot=full&apikey=${API_KEY}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Помилка при завантаженні деталей:", error);
    return null;
  }
};
