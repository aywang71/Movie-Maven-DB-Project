import { useState } from "react";
import { Grid, Box, Typography, Card, List, ListItemIcon, IconButton, ListItem, Divider } from "@mui/material";
import { Close } from "@mui/icons-material"
import QuickSearch from "../components/QuickSearch";
import { getYear } from "../utils";

const MovieRecommendationPage = () => {
    const [movieList, setMovieList] = useState([]);

    return (
        <>
            <Grid container spacing={2} sx={{ m: 'auto', maxWidth: 750, p: 5 }}>
                {/* Movie into */}
                <Grid item xs={7}>
                    <Box elevation={3}>
                        {/* Main info card */}
                        <Card variant="outlined" width="100%" sx={{ mt: 2, p: 2 }}>
                            <Typography variant='h4' mb={1}>Your Watch List</Typography>
                            <QuickSearch sendValue={(val) => {
                                console.log(val);
                                if (movieList.every(m => m.id !== val.id)) {
                                    setMovieList(old => [...old, val])
                                }
                            }} disabled={movieList.length >= 10} />
                            <List>
                                {movieList.map(movie =>
                                    <div key={movie.id}>
                                        <ListItem sx={{ paddingLeft: 0 }} disableGutters mr={0}>
                                            <Grid container alignItems="center">
                                                <Grid item sx={{ display: 'flex', width: 60 }}>
                                                    <Box
                                                        component="img"
                                                        src={`https://image.tmdb.org/t/p/original${movie?.poster_path}`}
                                                        elevation={3}
                                                        sx={{ width: '100%', borderRadius: '5px' }}
                                                    />
                                                </Grid>
                                                <Grid item ml={2} sx={{ width: '200px', wordWrap: 'break-word' }}>
                                                    <Typography variant='h6'>{movie.title}{/*{movie?.release_date && <> ({getYear(movie.release_date)})</>}*/}</Typography>
                                                    {movie?.release_date && <Typography mt={0.5} variant='body2'>({getYear(movie.release_date)})</Typography>}
                                                    {/* <Typography variant='body2' style={{ lineHeight: 1.2 }}>{movie.overview.slice(0, 70)}{movie.overview.length > 70 && <> ...</>}</Typography> */}

                                                </Grid>
                                            </Grid>
                                            <ListItemIcon sx={{ minWidth: 0, marginRight: 1 }}>
                                                <IconButton edge="end" aria-label="delete" onClick={() => setMovieList(old => old.filter(m => m.id !== movie.id))}>
                                                    <Close />
                                                </IconButton>
                                            </ListItemIcon>
                                        </ListItem>
                                        <Divider />
                                    </div>
                                )}
                            </List>
                        </Card>
                    </Box>
                </Grid>

                {/* Movie Poster */}
                <Grid item xs={5}>

                </Grid>
            </Grid >
        </>
    );
};

export default MovieRecommendationPage;
