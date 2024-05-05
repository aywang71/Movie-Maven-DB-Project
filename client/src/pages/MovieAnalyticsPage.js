import React, { useState } from 'react';
import { TextField, Button, Grid, Box, Typography, Autocomplete, CircularProgress, Snackbar, Table, TableBody, TableRow, TableCell, Card } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const MovieAnalyticsPage = () => {
  const [movies, setMovies] = useState([]);
  const [movieOptions, setMovieOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analyticsResults, setAnalyticsResults] = useState({data: {}});
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

    setIsLoading(true);
    const moviesInput = movies.map(movie => movie.id).join(',');
    fetch(`http://localhost:8080/userList/?movies=${moviesInput}`)
      .then(resp => resp.json())
      .then(respJson => setAnalyticsResults({data: respJson[0]}))
      .catch(error => console.error(error))
      .finally(() => setIsLoading(false));
  };

  // Function to handle Snackbar close
  const handleCloseSnackbar = () => {
    setErrorMessage('');
  };

  const infoList = [
    { prop: 'Number of Movies', value: analyticsResults?.data?.num_movies },
    { prop: 'Vote Average', value: analyticsResults?.data?.vote_average },
    { prop: 'Average Vote Count', value: analyticsResults?.data?.vote_count },
    { prop: 'Average Revenue', value: analyticsResults?.data?.avg_revenue },
    { prop: 'Average Budget', value: analyticsResults?.data?.avg_budget },
    { prop: 'Average Runtime', value: analyticsResults?.data?.avg_runtime },
    { prop: 'Average Popularity', value: analyticsResults?.data?.avg_popularity }
  ];

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Grid container spacing={2} sx={{ m: 'auto', maxWidth: 1200, p: 5 }}>
        {/* Title */}
        <Typography variant="h4" gutterBottom>
          Movie Analytics
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
        {(isLoading || Object.keys(analyticsResults.data).length > 0) && (
          <Box mt={4}>
            <Typography variant="h4" gutterBottom>
              Analytics
            </Typography>
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw' }}>
                <CircularProgress />
              </div>
            ) : (
              <Card variant="outlined" width="100%" sx={{ mt: 2, p: 2 }}>
                <Table size='small'>
                  <TableBody>
                    {infoList.map(({ prop, value }) =>
                      !!value && (
                        <TableRow key={prop} >
                          <TableCell sx={{ borderBottom: 'none' }}>
                            <Typography variant='body1' fontWeight='bold' fontStyle='normal' lineHeight={1} mb={1}>
                              {prop}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ borderBottom: 'none' }} align='right'>
                            <Typography variant='body1' fontStyle='normal' lineHeight={1}>
                              {value}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </Card>
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

export default MovieAnalyticsPage;
