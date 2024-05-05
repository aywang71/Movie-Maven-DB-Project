import React, { useState } from 'react';
import { TextField, Button, Grid, Box, Typography, Autocomplete, CircularProgress, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

import GridComponent from '../components/GridComponent';

const RecommendationPage = () => {
  const [movies, setMovies] = useState([]);
  const [movieOptions, setMovieOptions] = useState([]);
  const [movieRecommendations, setMovieRecommendations] = useState([]);
  const [providerRecommendations, setProviderRecommendations] = useState([]);
  const [movieIsLoading, setMovieIsLoading] = useState(false);
  const [providerIsLoading, setProviderIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Function to fetch movie options
  const fetchOptions = async (value) => {
    if (value === "") {
      setMovieOptions([]);
    } else {
      fetch(`http://localhost:8080/quickSearch/${value}`)
        .then(resp => resp.json())
        .then(respJson => setMovieOptions(respJson))
        .catch(error => console.error(error))
    }
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate movie array
    if (movies.length === 0) {
      setErrorMessage('Please select at least one movie.');
      return;
    }

    setMovieIsLoading(true);
    const moviesInput = movies.map(movie => movie.id).join(',');
    fetch(`http://localhost:8080/movie_recommendations/?movies=${moviesInput}`)
      .then(resp => resp.json())
      .then(respJson => setMovieRecommendations(respJson))
      .catch(error => console.error(error))
      .finally(() => setMovieIsLoading(false));

    setProviderIsLoading(true);
    fetch(`http://localhost:8080/provider_recommendations/?movies=${moviesInput}`)
      .then(resp => resp.json())
      .then(respJson => setProviderRecommendations(respJson.map(p => ({ id: p.provider, title: p.provider, provider_path: p.provider_logo }))))
      .catch(error => console.error(error))
      .finally(() => setProviderIsLoading(false));
  };

  // Function to handle Snackbar close
  const handleCloseSnackbar = () => {
    setErrorMessage('');
  };

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Grid container spacing={2} sx={{ m: 'auto', maxWidth: 1200, p: 5 }}>
        {/* Title */}
        <Typography variant="h4" gutterBottom>
          Recommendations
        </Typography>
        <Grid container spacing={6} justifyContent="center" alignItems="center">
          {/* Movies */}
          <Grid item xs={12} md={10}>
            <Autocomplete
              multiple
              id="movies"
              options={movieOptions}
              getOptionLabel={(option) => option.title}
              value={movies}
              onChange={(event, newValue) => setMovies(newValue)}
              onInputChange={(event, newInputValue) => fetchOptions(newInputValue)}
              renderInput={(params) => <TextField {...params} label="Movies" />}
            />
          </Grid>
          {/* Submit button */}
          <Grid item xs={12} md={2}>
            <Button variant="contained" type="submit" onClick={handleSubmit}>Search</Button>
          </Grid>
        </Grid>
        {/* Display search results in Grid Component */}
        {(movieIsLoading || providerIsLoading || movieRecommendations.length > 0 || providerRecommendations.length > 0) && (
          <Box mt={4} justifyContent="center">
            {movieIsLoading || providerIsLoading ? (
              <CircularProgress />
            ) : (
              <>
              <Typography variant="h4" gutterBottom>
                Top Movies
              </Typography>
              <GridComponent items={movieRecommendations} type="movie" />
              <Typography variant="h4" gutterBottom>
                Top Providers
              </Typography>
              <GridComponent items={providerRecommendations} type="provider" />
              </>
            )}
          </Box>
        )}
        {/* Error Snackbar */}
        <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <MuiAlert elevation={6} variant="filled" severity="error" onClose={handleCloseSnackbar}>
            {errorMessage}
          </MuiAlert>
        </Snackbar>
      </Grid>
    </Box>
  );
};

export default RecommendationPage;
