import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Container, Typography } from '@mui/material';

import GridComponent from '../components/GridComponent';

const BrowsePage = () => {
  const [topMovies, setTopMovies] = useState([]);
  const [topMoviesByGenres, setTopMoviesByGenres] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      // Fetch top movies
      fetch(`http://localhost:8080/topMovies`)
        .then(response => response.json())
        .then(data => setTopMovies(data))
        .catch(error => console.error('Error fetching top movies:', error));

      // Fetch top movies by genres
      const genres = ['Action', 'Animation', 'Comedy', 'Drama', 'Family', 'Horror'];
      const moviesByGenres = {};
      for (const genre of genres) {
        try {
          const response = await fetch(`http://localhost:8080/topMovies/genres/${genre}`);
          const data = await response.json();
          moviesByGenres[genre] = data;
        } catch (error) {
          console.error(`Error fetching ${genre} movies:`, error);
        }
      }
      setTopMoviesByGenres(moviesByGenres);
      setIsLoading(false);
    };
    fetchMovies();
  }, []);

  return (
    <>
    {isLoading ? (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </div>
    ) : (
      <Container maxWidth="lg">
        <Box my={4}>
          <Typography variant="h4" gutterBottom>Top Movies</Typography>
          <GridComponent items={topMovies} type="movie" />
        </Box>
        
        {Object.entries(topMoviesByGenres).map(([genre, movies]) => (
          <Box key={genre} my={4}>
            <Typography variant="h4" gutterBottom>{genre}</Typography>
            <GridComponent items={movies} type="movie" />
          </Box>
        ))}
      </Container>
    )}
    </>
  );
};

export default BrowsePage;
