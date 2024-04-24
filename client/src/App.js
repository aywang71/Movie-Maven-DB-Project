import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { createTheme } from "@mui/material/styles";

import NavBar from './components/NavBar';
import BrowsePage from './pages/BrowsePage';
import SearchPage from './pages/SearchPage';
import RecommendPage from './pages/RecommendPage';
import MoviePage from "./pages/MoviePage";

export const theme = createTheme({
  palette: {
    primary: {
      main: '#000000'
    },
    secondary: {
      main: '#A4CEE7'
    }
  },
  typography: {
    fontFamily: [
      '"Source Sans 3"',
      'Roboto', // Your custom font here
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h3: {
      fontSize: '2em',
      fontWeight: 'bold'
    },
    body2: {
      fontSize: '12',
      fontStyle: 'italic'
    },
    label: {
      fontSize: '10pt',
      color: 'white',
      fontWeight: 'bold',
      textTransform: 'uppercase'
    }
  }
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<BrowsePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/recommend" element={<RecommendPage />} />
          <Route path="/movie/:id" element={<MoviePage />} />
          <Route path="/movie/random" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
