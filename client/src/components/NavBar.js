import { AppBar, Box, Button, Toolbar, Typography, Menu, MenuItem } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuickSearch from './QuickSearch';

const NavBar = () => {
  const navigate = useNavigate();

  // State to manage the dropdown menus
  const [recommendationAnchorEl, setRecommendationAnchorEl] = useState(null);
  const [analyticsAnchorEl, setAnalyticsAnchorEl] = useState(null);

  // Open the dropdown menu
  const handleRecommendationClick = (event) => {
    setRecommendationAnchorEl(event.currentTarget);
  };

  const handleAnalyticsClick = (event) => {
    setAnalyticsAnchorEl(event.currentTarget);
  };

  // Close the dropdown menu and navigate to the selected option
  const handleMenuClose = (route) => {
    setRecommendationAnchorEl(null);
    setAnalyticsAnchorEl(null);
    navigate(route);
  };

  const recommendationItems = [
    { label: "Binge Watch", route: "/bingeWatch" },
    { label: "Movie Recommendation", route: "/movieRecommendation" },
  ];

  const analyticsItems = [
    { label: "Movie Analytics", route: "/movieAnalytics" },
    { label: "Category Analytics", route: "/categoryAnalytics" }
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <MovieIcon size="large" sx={{ mx: 2, color: "inherit" }} />
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1, color: 'inherit' }}
          >
            Movie Maven
          </Typography>
          {/* Random Button */}
          <Button
            onClick={() => {
              if (window.location.href.endsWith("/randomMovie")) {
                navigate(0);
              } else {
                navigate("/randomMovie");
                navigate(0);
              }
            }}
            sx={{ my: 2, mx: 2, color: 'inherit', display: 'block' }}
          >
            Random Movie
          </Button>
          {/* Browse Button */}
          <Button
            onClick={() => navigate("/browse")}
            sx={{ my: 2, mx: 2, color: 'inherit', display: 'block' }}
          >
            Browse
          </Button>
          {/* Search Button */}
          <Button
            onClick={() => navigate("/search")}
            sx={{ my: 2, mx: 2, color: 'inherit', display: 'block' }}
          >
            Search
          </Button>
          {/* Recommendation Button */}
          <Button
            onClick={handleRecommendationClick}
            sx={{ my: 2, mx: 2, color: 'inherit', display: 'block' }}
          >
            Recommendation
          </Button>
          {/* Recommendation Menu */}
          <Menu
            anchorEl={recommendationAnchorEl}
            open={Boolean(recommendationAnchorEl)}
            onClose={() => setRecommendationAnchorEl(null)}
          >
            {recommendationItems.map((item) => (
              <MenuItem
                key={item.label}
                onClick={() => handleMenuClose(item.route)}
              >
                {item.label}
              </MenuItem>
            ))}
          </Menu>
          {/* Analytics Button */}
          <Button
            onClick={handleAnalyticsClick}
            sx={{ my: 2, mx: 2, color: 'inherit', display: 'block' }}
          >
            Analytics
          </Button>
          {/* Analytics Menu */}
          <Menu
            anchorEl={analyticsAnchorEl}
            open={Boolean(analyticsAnchorEl)}
            onClose={() => setAnalyticsAnchorEl(null)}
          >
            {analyticsItems.map((item) => (
              <MenuItem
                key={item.label}
                onClick={() => handleMenuClose(item.route)}
              >
                {item.label}
              </MenuItem>
            ))}
          </Menu>
          <QuickSearch
            hideLoading
            sx={{ flexGrow: 1 }}
            label='Search'
            size='small'
            background='#3b3b3b'
            variant='filled'
            sendValue={v => navigate(`/movieInformation/${v.id}`)}
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default NavBar;
