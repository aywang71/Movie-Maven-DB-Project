import React from 'react';
import { Box, Container, Typography } from '@mui/material';

import MovieGrid from '../components/MovieGrid';

const topMovies = [
  { id: 1, title: 'Movie 1' },
  { id: 2, title: 'Movie 2' },
  { id: 3, title: 'Movie 3' },
];

const topMoviesByGenres = {
  Action: [
    { id: 4, title: 'Action Movie 1' },
    { id: 5, title: 'Action Movie 2' },
  ],
  Comedy: [
    { id: 6, title: 'Comedy Movie 1' },
    { id: 7, title: 'Comedy Movie 2' },
  ],
  Drama: [
    { id: 8, title: 'Drama Movie 1' },
    { id: 9, title: 'Drama Movie 2' },
  ],
};

const BrowsePage = () => {
  return (
    <Container  maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" gutterBottom>Top Movies</Typography>
        <MovieGrid movies={topMovies} />
      </Box>
      
      {Object.entries(topMoviesByGenres).map(([genre, movies]) => (
        <Box key={genre} my={4}>
          <Typography variant="h4" gutterBottom>{genre}</Typography>
          <MovieGrid movies={movies} />
        </Box>
      ))}
    </Container>
  );
};

export default BrowsePage;
