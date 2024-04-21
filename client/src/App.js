import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { createTheme } from "@mui/material/styles";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import SearchPage from './pages/SearchPage';
import RecommendPage from './pages/RecommendPage';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#000000'
    },
    secondary: {
      main: '#A4CEE7'
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
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/recommend" element={<RecommendPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
