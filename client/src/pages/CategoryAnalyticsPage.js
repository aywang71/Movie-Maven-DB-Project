import React, { useState } from 'react';
import { TextField, Button, Grid, Box, Typography, Autocomplete, CircularProgress, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

import { genres, providers, languages } from "../utils";

const CategoryAnalyticsPage = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    genres: [],
    providers: [],
    languages: [],
  });
  const [analyticsResults, setAnalyticsResults] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Function to handle autocomplete change for genres
  const handleGenreChange = (event, value) => {
    setSearchCriteria(prevState => ({
      ...prevState,
      genres: value,
    }));
  };

  // Function to handle autocomplete change for providers
  const handleProviderChange = (event, value) => {
    setSearchCriteria(prevState => ({
      ...prevState,
      providers: value,
    }));
  };

  // Function to handle autocomplete change for languages
  const handleLanguageChange = (event, value) => {
    setSearchCriteria(prevState => ({
      ...prevState,
      languages: value,
    }));
  };

  // Function to get tables
  const getTables = () => {
    const tables = [];
    if (searchCriteria.genres.length > 0) {
      tables.push('Genres');
    }
    if (searchCriteria.providers.length > 0) {
      tables.push('Providers');
    }
    if (searchCriteria.languages.length > 0) {
      tables.push('SpokenLanguages');
    }
    return tables;
  };

  // Function to get filters
  const getFilters = () => {
    const filters = [];
    if (searchCriteria.genres.length > 0) {
      filters.push(`Genres.genre IN (${searchCriteria.genres.map(item => `'${item}'`).join(', ')})`);
    }
    if (searchCriteria.providers.length > 0) {
      filters.push(`Providers.provider IN (${searchCriteria.providers.map(item => `'${item}'`).join(', ')})`);
    }
    if (searchCriteria.languages.length > 0) {
      filters.push(`SpokenLanguages.language IN (${searchCriteria.languages.map(item => `'${item}'`).join(', ')})`);
    }
    return filters;
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate search criteria
    if (searchCriteria.genres.length === 0 && 
        searchCriteria.providers.length === 0 && 
        searchCriteria.languages.length === 0) {
      setErrorMessage('Must select at least one filter.');
      return;
    }
    
    setIsLoading(true);
    const tables = getTables();
    const filters = getFilters();
    fetch(`http://localhost:8080/groupMulti/?`
      + `tables=${tables}&`
      + `filters=${filters}`
    )
      .then(resp => resp.json())
      .then(respJson => setAnalyticsResults(respJson[0]))
      .catch(error => console.error(error))
      .finally(() => setIsLoading(false));
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
          Category Analytics
        </Typography>
        <Grid container spacing={6} justifyContent="center" alignItems="center">
          {/* Genres */}
          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple
              id="genres"
              options={genres}
              getOptionLabel={(option) => option}
              value={searchCriteria.genres}
              onChange={handleGenreChange}
              renderInput={(params) => <TextField {...params} label="Genres" />}
            />
          </Grid>
          {/* Providers */}
          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple
              id="providers"
              options={providers}
              getOptionLabel={(option) => option.provider}
              value={searchCriteria.providers}
              onChange={handleProviderChange}
              renderInput={(params) => <TextField {...params} label="Providers" />}
            />
          </Grid>
          {/* Languages */}
          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple
              id="languages"
              options={languages}
              getOptionLabel={(option) => option}
              value={searchCriteria.languages}
              onChange={handleLanguageChange}
              renderInput={(params) => <TextField {...params} label="Languages" />}
            />
          </Grid>
          {/* Submit button */}
          <Grid item xs={12}>
            <Button variant="contained" type="submit" onClick={handleSubmit}>Search</Button>
          </Grid>
        </Grid>
        {/* Display search results in Grid Component */}
        {(isLoading || analyticsResults) && (
          <Box mt={4}>
            <Typography variant="h4" gutterBottom>
              Analytics
            </Typography>
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw' }}>
                <CircularProgress />
              </div>
            ) : (
                {/* Display Analytics Component */}
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

export default CategoryAnalyticsPage;
