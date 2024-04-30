import { useState } from 'react';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import { useNavigate } from 'react-router-dom';
import RandomMovie from './RandomMovie';


export default function NavBar() {

  const [showRandom, setShowRandom] = useState(false);
  const navigate = useNavigate();
  const items = [
    { label: "Browse", route: "/browse" },
    { label: "Search", route: "/search" },
    { label: "Recommend", route: "/recommend" }
  ]

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
          {items.map((item) => (
            <Button
              key={item.label}
              onClick={() => navigate(item.route)}
              sx={{ my: 2, mx: 2, color: 'inherit', display: 'block' }}
            >
              {item.label}
            </Button>
          ))}
          <Button
            key="Random"
            onClick={() => setShowRandom(true)}
            sx={{ my: 2, mx: 2, color: 'inherit', display: 'block' }}
          >
            Random
          </Button>
        </Toolbar>
      </AppBar>
      {showRandom && <RandomMovie setShowRandom={setShowRandom} />}
    </Box>
  );
}
