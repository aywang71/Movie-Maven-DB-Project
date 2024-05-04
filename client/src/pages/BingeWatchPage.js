import React, { useState } from 'react';
import { TextField, Button, Grid, Box, Typography, Slider, InputLabel, Autocomplete, CircularProgress, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

import { genres, providers } from "../utils";
import GridComponent from '../components/GridComponent';

const BingeWatchPage = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    genres: [],
    providers: [],
    timeAvailable: 0,
    runtimeRange: [60, 180]
  });
  const [searchResults, setSearchResults] = useState([]);
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

  // Function to handle slider change for release date range
  const handleRuntimeChange = (event, newValue) => {
    setSearchCriteria(prevState => ({
      ...prevState,
      runtimeRange: newValue,
    }));
  };

  // Function to handle time available change
  const handleTimeAvailableChange = (event) => {
    setSearchCriteria(prevState => ({
        ...prevState,
        timeAvailable: event.target.value,
      }));
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate time available
    const timeAvailableInt = parseInt(searchCriteria.timeAvailable);
    if (isNaN(timeAvailableInt) || timeAvailableInt < 60) {
      setErrorMessage('Time available must be an integer greater than, or equal to, 60.');
      return;
    }

    setIsLoading(true);

    fetch(`http://localhost:8080/binge_watching?`
      + (searchCriteria.genres.length > 0 ? `genres_list=${searchCriteria.genres.toString()}&` : '')
      + (searchCriteria.providers.length > 0 ? `providers_list=${searchCriteria.providers.map(provider => provider.platform_id).toString()}&` : '')
      + `min_runtime=${searchCriteria.runtimeRange[0]}&`
      + `max_runtime=${searchCriteria.runtimeRange[1]}&`
      + `time_available=${searchCriteria.timeAvailable}`
    )
      .then(resp => resp.json())
      .then(respJson => setSearchResults(respJson))
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
          Binge Watch
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
          {/* Time Available */}
          <Grid item xs={12} md={4}>
            <TextField
              label="Time Available (minutes)"
              type="number"
              defaultValue={searchCriteria.timeAvailable}
              onChange={handleTimeAvailableChange}
              InputProps={{ inputProps: { min: 60 } }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          {/* Runtime Range */}
          <Grid item xs={12} md={8}>
            <InputLabel id="runtime-range-label">Runtime Range</InputLabel>
            <Slider
              name="runtimeRange"
              value={searchCriteria.runtimeRange}
              onChange={handleRuntimeChange}
              valueLabelDisplay="auto"
              min={60}
              max={180}
              aria-labelledby="runtime-range-label"
            />
          </Grid>
          {/* Submit button */}
          <Grid item xs={12}>
            <Button variant="contained" type="submit" onClick={handleSubmit}>Search</Button>
          </Grid>
        </Grid>
        {/* Display search results in Grid Component */}
        {(isLoading || searchResults.length > 0) && (
          <Box mt={4}>
            <Typography variant="h4" gutterBottom>
              Binge Schedule
            </Typography>
            {isLoading ? (
                
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw' }}>
                <CircularProgress />
              </div>
            ) : (
                <GridComponent items={searchResults} type={"movie"} binge={true}/>
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

export default BingeWatchPage;
