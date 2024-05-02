import * as React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';

const MovieGrid = ({movies}) => {
  return (
    <Grid container spacing={3}>
      {movies.map(movie => (
        <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
            <Box position="relative">
            {/* TODO: `Replace with movie poster. */}
            <Paper
              elevation={3}
              sx={{
                width: '100%',
                paddingTop: '150%',
                position: 'relative'
              }}
            >
              <Typography 
                variant="subtitle1"
                sx={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  width: '100%', 
                  backgroundColor: '#FFFFF', 
                  padding: '8px', 
                  textAlign: 'center' 
                }}
              >
                {movie.title}
              </Typography>
            </Paper>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default MovieGrid;
