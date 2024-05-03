import React from 'react';
import { Grid, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const MovieGrid = ({ movies }) => {
  return (
    <Grid container spacing={3}>
      {movies.map(movie => (
        <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
          <Box>
            <Link to={`/movieInformation/${movie.id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Link>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default MovieGrid;
