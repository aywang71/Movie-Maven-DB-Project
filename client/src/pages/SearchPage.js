import React, { useState } from 'react';
import { TextField, Button, Grid, Box, Checkbox, FormControlLabel, Typography, Slider, InputLabel, Autocomplete, CircularProgress } from '@mui/material';

import { genres, providers } from "../utils";
import GridComponent from '../components/GridComponent';

const SearchPage = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    genres: [],
    providers: [],
    voteCountRange: [0, 35000],
    voteAvgRange: [0, 10],
    releaseDateRange: [1900, 2024],
    adult: 0,
  });
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  // Function to handle slider change for vote count range
  const handleVoteCountChange = (event, newValue) => {
    setSearchCriteria(prevState => ({
      ...prevState,
      voteCountRange: newValue,
    }));
  };

  // Function to handle slider change for vote average range
  const handleVoteAvgChange = (event, newValue) => {
    setSearchCriteria(prevState => ({
      ...prevState,
      voteAvgRange: newValue,
    }));
  };

  // Function to handle slider change for release date range
  const handleReleaseDateChange = (event, newValue) => {
    setSearchCriteria(prevState => ({
      ...prevState,
      releaseDateRange: newValue,
    }));
  };

  // Function to handle input change
  const handleAdultChange = (event) => {
    setSearchCriteria(prevState => ({
      ...prevState,
      adult: event.target.checked ? 1 : 0
    }));
  };


  // Function to handle form submission
  const handleSubmit = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    fetch(`http://localhost:8080/filtered_movies?`
      + (searchCriteria.genres.length > 0 ? `genres_list=${searchCriteria.genres.toString()}&` : '')
      + (searchCriteria.providers.length > 0 ? `providers_list=${searchCriteria.providers.toString()}&` : '')
      + `min_count=${searchCriteria.voteCountRange[0]}&`
      + `max_count=${searchCriteria.voteCountRange[1]}&`
      + `min_avg=${searchCriteria.voteAvgRange[0]}&`
      + `max_avg=${searchCriteria.voteAvgRange[1]}&`
      + `min_date=${searchCriteria.releaseDateRange[0]}-01-01&`
      + `max_date=${searchCriteria.releaseDateRange[1]}-01-01&`
      + `is_adult=${searchCriteria.adult}`
    )
      .then(resp => resp.json())
      .then(respJson => setSearchResults(respJson))
      .catch(error => console.error(error))
      .finally(() => setIsLoading(false));
  };

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Grid container spacing={2} sx={{ m: 'auto', maxWidth: 1200, p: 5 }}>
        {/* Title */}
        <Typography variant="h4" gutterBottom>
          Movie Search
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
              getOptionLabel={(option) => option}
              value={searchCriteria.providers}
              onChange={handleProviderChange}
              renderInput={(params) => <TextField {...params} label="Providers" />}
            />
          </Grid>
          {/* Vote Count Range */}
          <Grid item xs={12} md={4}>
            <InputLabel id="vote-count-range-label">Vote Count Range</InputLabel>
            <Slider
              name="voteCountRange"
              value={searchCriteria.voteCountRange}
              onChange={handleVoteCountChange}
              valueLabelDisplay="auto"
              min={0}
              max={35000}
              aria-labelledby="vote-count-range-label"
            />
          </Grid>
          {/* Vote Average Range */}
          <Grid item xs={12} md={4}>
            <InputLabel id="vote-avg-range-label">Vote Average Range</InputLabel>
            <Slider
              name="voteAvgRange"
              value={searchCriteria.voteAvgRange}
              onChange={handleVoteAvgChange}
              valueLabelDisplay="auto"
              min={0}
              max={10}
              aria-labelledby="vote-avg-range-label"
            />
          </Grid>
          {/* Release Date Range */}
          <Grid item xs={12} md={4}>
            <InputLabel id="release-date-range-label">Release Date Range</InputLabel>
            <Slider
              name="releaseDateRange"
              value={searchCriteria.releaseDateRange}
              onChange={handleReleaseDateChange}
              valueLabelDisplay="auto"
              min={1900}
              max={2024}
              aria-labelledby="release-date-range-label"
            />
          </Grid>
          {/* Adult */}
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox name="adult" onChange={handleAdultChange} />}
              label="Adult Content"
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
              Top Results
            </Typography>
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw' }}>
                <CircularProgress />
              </div>
            ) : (
              <GridComponent items={searchResults} type={"movie"} />
            )}
          </Box>
        )}
      </Grid>
    </Box>
  );
};

export default SearchPage;
