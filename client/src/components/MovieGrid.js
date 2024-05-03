import React, { useState } from 'react';
import { Grid, Box, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const MovieGrid = ({ movies }) => {
  // State to track current page
  const [currentPage, setCurrentPage] = useState(1);
  // Number of items per page (one row)
  const itemsPerPage = 6;

  // Calculate total number of pages
  const totalPages = Math.ceil(movies.length / itemsPerPage);

  // Calculate starting and ending index for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  // Slice movies array to display only items for current page
  const currentMovies = movies.slice(startIndex, endIndex);

  // Function to handle pagination button click
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <Grid container spacing={3}>
        {currentMovies.map((movie) => (
          <Grid item key={movie.id} xs={2}>
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
      {/* Pagination controls */}
      <Box mt={2} textAlign="center">
        {/* Previous button */}
        <IconButton
          aria-label="Previous"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <KeyboardArrowLeftIcon />
        </IconButton>
        {/* Page indicator */}
        <Box component="span" mx={2}>
          Page {currentPage} of {totalPages}
        </Box>
        {/* Next button */}
        <IconButton
          aria-label="Next"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <KeyboardArrowRightIcon />
        </IconButton>
      </Box>
    </>
  );
};

export default MovieGrid;
