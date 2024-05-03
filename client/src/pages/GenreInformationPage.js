import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Grid, Box, Typography, Card, Table, TableBody, TableRow, TableCell, CircularProgress } from "@mui/material";

import { formatMoney } from "../utils";
import GridComponent from '../components/GridComponent';

const GenreInformationPage = () => {
  const { genre } = useParams();
  const [genreData, setGenreData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [topMovies, setTopMovies] = useState([]);

  // Fetch movie data on load
  useEffect(() => {
    const genreParam = genre.toLowerCase();
    fetch(`http://localhost:8080/groupSingle/Genres/${genreParam}`)
      .then(resp => resp.json())
      .then(respJson => { 
        setGenreData(respJson);
        setIsLoading(false);
      })
      .catch(error => { 
        console.error(error) 
        setIsLoading(false);
      });
    
    fetch(`http://localhost:8080/topMovies/genres/${genreParam}`)
      .then(resp => resp.json())
      .then(respJson => { 
        setTopMovies(respJson);
        setIsLoading(false);
      })
      .catch(error => { 
        console.error(error);
        setIsLoading(false);
      });      
  }, [genre]);

  const infoList = [
    { prop: 'Number of Movies', value: genreData[0]?.num_movies },
    { prop: 'Vote Average', value: genreData[0]?.vote_average },
    { prop: 'Vote Count', value: genreData[0]?.vote_count },
    { prop: 'Average Revenue', value: formatMoney(genreData[0]?.avg_revenue) },
    { prop: 'Average Budget', value: formatMoney(genreData[0]?.avg_budget) },
    { prop: 'Average Runtime', value: genreData[0]?.avg_runtime + " min"},
    { prop: 'Average Popularity', value: genreData[0]?.avg_popularity }
  ];

  return (
    <>
    {isLoading ? (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </div>
      ) : (
      <Grid container spacing={2} sx={{ m: 'auto', maxWidth: 1000, p: 5 }}>
        {/* Genre info */}
        <Grid item xs={7}>
          <Box elevation={3}>
            <Typography variant="h4" sx={{ mb: 1 }}>{genre}</Typography>

            {/* Main info card */}
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
          </Box>
        </Grid>
        {/* Top Movies */}
        <Box my={4}>
            <Typography variant="h4" gutterBottom>Top Movies </Typography>
            <GridComponent items={topMovies} type="movie" />
        </Box>
      </Grid >
    )}
  </>
  );
};

export default GenreInformationPage;
