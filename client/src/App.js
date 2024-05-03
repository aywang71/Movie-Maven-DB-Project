import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { createTheme } from "@mui/material/styles";

import NavBar from './components/NavBar';

import BingeWatchPage from './pages/BingeWatchPage';
import BrowsePage from './pages/BrowsePage';
import CategoryAnalyticsPage from './pages/CategoryAnalyticsPage';
import GenreInformationPage from './pages/GenreInformationPage';
import MovieAnalyticsPage from './pages/MovieAnalyticsPage';
import MovieInformationPage from "./pages/MovieInformationPage";
import MovieRecommendationPage from "./pages/MovieRecommendationPage";
import PlatformInformationPage from "./pages/PlatformInformationPage";
import PlatformRecommendationPage from './pages/PlatformRecommendationPage';
import SearchPage from './pages/SearchPage';

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
          <Route path="/bingeWatch" element={<BingeWatchPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/categoryAnalytics" element={<CategoryAnalyticsPage />} />
          <Route path="/genreInformation/:genre" element={<GenreInformationPage />} />
          <Route path="/movieAnalytics" element={<MovieAnalyticsPage />} />
          <Route path="/randomMovie" element={<MovieInformationPage />} />
          <Route path="/movieInformation/:id" element={<MovieInformationPage />} />
          <Route path="/movieRecommendation" element={<MovieRecommendationPage />} />
          <Route path="/platformInformation/:platform" element={<PlatformInformationPage />} />
          <Route path="/platformRecommendation" element={<PlatformRecommendationPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
