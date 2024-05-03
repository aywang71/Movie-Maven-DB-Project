import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Grid, Box, Typography, Card, Table, TableBody, TableRow, TableCell, CircularProgress } from "@mui/material";

import { formatMoney } from "../utils";
import GridComponent from '../components/GridComponent';

const PlatformInformationPage = () => {
  const { platform } = useParams();
  const [platformData, setPlatformData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [topMovies, setTopMovies] = useState([]);

  // Fetch movie data on load
  useEffect(() => {
    const platformParam = platform.toLowerCase();
    fetch(`http://localhost:8080/platformData/${platformParam}`)
      .then(resp => resp.json())
      .then(respJson => { 
        setPlatformData(respJson);
        setIsLoading(false);
      })
      .catch(error => { 
        console.error(error) 
        setIsLoading(false);
      });
    
    fetch(`http://localhost:8080/topMovies/providers/${platformParam}`)
      .then(resp => resp.json())
      .then(respJson => { 
        setTopMovies(respJson);
        setIsLoading(false);
      })
      .catch(error => { 
        console.error(error);
        setIsLoading(false);
      });      
  }, [platform]);

  const infoList = [
    { prop: 'Number of Movies', value: platformData[0]?.num_movies },
    { prop: 'Vote Average', value: platformData[0]?.vote_average },
    { prop: 'Vote Count', value: platformData[0]?.vote_count },
    { prop: 'Average Revenue', value: formatMoney(platformData[0]?.avg_revenue) },
    { prop: 'Average Budget', value: formatMoney(platformData[0]?.avg_budget) },
    { prop: 'Average Runtime', value: platformData[0]?.avg_runtime + " min"},
    { prop: 'Average Popularity', value: platformData[0]?.avg_popularity }
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
            <Typography variant="h4" sx={{ mb: 1 }}>{[platform]}</Typography>

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
        {/* Platform Logo */}
        {!!platformData[0]?.logo &&
          <Grid item xs={5}>
            <Box
              component="img"
              src={`https://image.tmdb.org/t/p/original${platformData[0]?.logo}`}
              elevation={3}
              sx={{ width: '100%' }}
            />
          </Grid>
        }
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

export default PlatformInformationPage;
