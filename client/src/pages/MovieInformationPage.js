import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Grid, Box, Typography, Divider, Button, Stack, Chip, Card, Table, TableBody, TableRow, TableCell, Rating, CircularProgress, Link } from "@mui/material";
import Label from "../components/Label";
import { useTheme } from "@emotion/react";
import { useNavigate } from "react-router-dom";

import { formatDate, formatMoney } from "../utils";
import GridComponent from '../components/GridComponent';

const MovieInformationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [movieData, setMovieData] = useState();
  const [rating, setRating] = useState(0);
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [providers, setProviders] = useState([]);

  // Fetch movie data on load
  useEffect(() => {
    const route = id ? `/movie/${id}` : '/random';
    fetch(`http://localhost:8080` + route)
      .then(resp => resp.json())
      .then(respJson => {
        setMovieData(respJson);
        setRating(respJson?.vote_average / 2);
        const providersNames = respJson.provider.split(', ');
        const providersPaths = respJson.provider_paths.split(', ');
        const providers = providersNames.map((name, i) => ({ id: name, title: name, provider_path: providersPaths[i] }));
        setProviders(providers);
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }, [id]);

  const infoList = [
    { prop: 'Runtime', value: movieData?.runtime && (movieData?.runtime + ' min') },
    { prop: 'Release', value: movieData?.release_date && formatDate(movieData?.release_date) },
    { prop: 'Status', value: movieData?.status },
    { prop: 'Popularity', value: movieData?.popularity },
    { prop: 'Languages', value: movieData?.language },
    { prop: 'Budget', value: movieData?.budget && formatMoney(movieData?.budget) },
    { prop: 'Revenue', value: movieData?.revenue && formatMoney(movieData?.revenue) },
    { prop: 'Runtime', value: movieData?.hey },
    { prop: 'Production Companies', value: movieData?.company }
  ];

  return (
    <>
    {isLoading ? (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </div>
      ) : (
      <Grid container spacing={2} sx={{ m: 'auto', maxWidth: 1000, p: 5 }}>
        {/* Movie into */}
        <Grid item xs={7}>
          <Box elevation={3}>
            {/* Shows adult tag only if 1 */}
            {!!movieData?.adult && <Label text="Adult" background={theme.palette.error.main} mb={1} />}
            <Typography variant="h3" sx={{ mb: 1 }}>{movieData?.title}</Typography>
            <Typography variant="body2" mb={2}>{movieData?.overview}</Typography>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

              {/* Rating display */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {!!movieData?.vote_average ? (
                  <>
                    <Rating onChange={(_, val) => { setRating(val) }} value={rating} precision={0.2} readOnly />
                    <Typography ml={1}>
                      <b>{rating.toFixed(2)}</b>
                      <i>{movieData?.vote_count && ` (${movieData?.vote_count} ratings)`}</i>
                    </Typography>
                  </>
                ) : (
                  <>
                    <Rating value={0} disabled readOnly />
                    <Typography ml={1}>
                      <i>(No ratings)</i>
                    </Typography>
                  </>
                )}
              </div>

              {/* Redirect to IMDb button */}
              {!!movieData?.imdb_id &&
                <Button mb={2} variant="contained" size="small" href={`https://www.imdb.com/title/${movieData?.imdb_id}`}>
                  IMDB
                </Button>
              }
            </div>

            {/* Main info card */}
            <Card variant="outlined" width="100%" sx={{ mt: 2, p: 2 }}>
              {!!movieData?.genre && (
                <>
                  <Stack direction="row" spacing={1} paddingLeft={2} padding={1}>
                    {/* Iterate over genres and make them clickable */}
                    {movieData?.genre.split(", ").map((genre) => (
                        <Link key={genre} to={`/genre/${genre}`}>
                          <Chip label={genre} clickable onClick={() => navigate(`/genreInformation/${genre}`)} />
                        </Link>
                    ))}
                  </Stack>
                  <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
                </>
              )}
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
          {/* Providers */}
          {!!movieData.provider &&
            <Box my={4}>
              <Typography variant="h4" gutterBottom>Stream On </Typography>
              <GridComponent items={providers} type="provider" />
            </Box>
          }
        </Grid>

        {/* Movie Poster */}
        {!!movieData?.poster_path &&
          <Grid item xs={5}>
            <Box
              component="img"
              src={`https://image.tmdb.org/t/p/original${movieData?.poster_path}`}
              elevation={3}
              sx={{ width: '100%' }}
            />
          </Grid>
        }
      </Grid >
    )}
  </>
  );
};

export default MovieInformationPage;
