import React, { useState } from 'react';
import { Grid, Box, IconButton, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const GridComponent = ({ items, type, binge }) => {
  const imageKey = type === 'movie' ? 'poster_path' : 'provider_path';
  const linkTo = type === 'movie' ? '/movieInformation/' : '/platformInformation/';

  // State to track current page
  const [currentPage, setCurrentPage] = useState(1);
  // Number of items per page (one row)
  const itemsPerPage = 6;

  // Calculate total number of pages
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Calculate starting and ending index for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  // Slice items array to display only items for current page
  const currentItems = items.slice(startIndex, endIndex);

  // Function to handle pagination button click
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <Grid container spacing={3}>
        {currentItems.map((item, index) => (
          <Grid item key={item.id} xs={2}>
            <Box>
              <Link to={linkTo + item.id}>
                <img
                  src={`https://image.tmdb.org/t/p/original${item[imageKey]}`}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Link>
              {/* Movie order and cumulative time */}
              {binge && (
                <Box mt={1}>
                  <Typography variant="subtitle2">Movie Order: {startIndex + index + 1}</Typography>
                  <Typography variant="subtitle2">Cumulative Time: {item.cumulative_time}</Typography>
                </Box>
              )}
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

export default GridComponent;
