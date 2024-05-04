import { useState, useEffect } from "react";
import { Grid, Box, Typography, Card, List, ListItemIcon, IconButton, ListItem, Divider, Button, CircularProgress } from "@mui/material";
import { Close } from "@mui/icons-material"
import QuickSearch from "../components/QuickSearch";
import GridComponent from "../components/GridComponent";
import { getYear } from "../utils";

const status = {
    HIDDEN: -1,
    LOADING: 0,
    SHOWN: 1
};

const MovieRecommendationPage = () => {
    const [movieList, setMovieList] = useState([]);
    const [recStatus, setRecStatus] = useState(status.HIDDEN);
    const [movieRecs, setMovieRecs] = useState([]);
    const [providerStatus, setProviderStatus] = useState(status.HIDDEN);
    const [providerRecs, setProviderRecs] = useState([]);

    useEffect(() => {
        // Load stored value from localStorage on component mount
        const storedValue = localStorage.getItem('movieList');
        if (storedValue) {
            setMovieList(JSON.parse(storedValue));
        }
    }, []);

    const getRecs = () => {
        setRecStatus(status.LOADING);
        setProviderStatus(status.LOADING);
        const movies = movieList.map(m => m.id).join(',');
        fetch(`http://localhost:8080/movie_recommendations/?movies=${movies}`)
            .then(resp => resp.json())
            .then(data => {
                console.log(data);
                setRecStatus(status.SHOWN);
                setMovieRecs(data);
                ;
            })
            .catch(() => setRecStatus(status.HIDDEN));

        fetch(`http://localhost:8080/provider_recommendations/?movies=${movies}`)
            .then(resp => resp.json())
            .then(data => {
                console.log("PROVIDE", data);
                setProviderStatus(status.SHOWN);
                setProviderRecs(data.map(p => { return { id: p.provider, title: p.provider, provider_path: p.provider_logo } }));
            })
            .catch(() => setProviderStatus(status.HIDDEN));
    };

    return (
        <>
            <Grid container spacing={4} sx={{ m: 'auto', maxWidth: '90%', p: 5 }}>
                {/* Movie into */}
                <Grid item xs={4}>
                    {/* <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: '5px' }}> */}
                        {/* Main info card */}
                        <Card variant='outlined' width="100%" sx={{ p: 2 }}>
                        <Typography variant='h4' mb={2}>Your Watch List</Typography>
                        <QuickSearch sendValue={(val) => {
                            console.log(val);
                            if (movieList.every(m => m.id !== val.id)) {
                                setMovieList(old => {
                                    const newList = [...old, val];
                                    localStorage.setItem('movieList', JSON.stringify(newList))
                                    return newList;
                                });
                            }
                        }} disabled={movieList.length >= 10}
                            sx={{ marginBottom: 1 }} />
                        <List>
                            {movieList.map(movie =>
                                <div key={movie.id}>
                                    <ListItem sx={{ paddingLeft: 0 }} disableGutters mr={0}>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item xs={4} >
                                                <Box
                                                    component="img"
                                                    src={`https://image.tmdb.org/t/p/original${movie?.poster_path}`}
                                                    elevation={3}
                                                    sx={{ width: '100%', borderRadius: '5px' }}
                                                />
                                            </Grid>
                                            <Grid item xs={7} sx={{ wordWrap: 'break-word' }}>
                                                <Typography variant='h6'>{movie.title}{/*{movie?.release_date && <> ({getYear(movie.release_date)})</>}*/}</Typography>
                                                {movie?.release_date && <Typography mt={0.5} variant='body2'>({getYear(movie.release_date)})</Typography>}
                                                {/* <Typography variant='body2' style={{ lineHeight: 1.2 }}>{movie.overview.slice(0, 70)}{movie.overview.length > 70 && <> ...</>}</Typography> */}
                                            </Grid>
                                        </Grid>
                                        <ListItemIcon sx={{ minWidth: 0, marginRight: 1 }}>
                                            <IconButton edge="end" aria-label="delete" onClick={() =>
                                                setMovieList(old => {
                                                    const newList = old.filter(m => m.id !== movie.id);
                                                    localStorage.setItem('movieList', JSON.stringify(newList));
                                                    return newList;
                                                })
                                            }>
                                                <Close />
                                            </IconButton>
                                        </ListItemIcon>
                                    </ListItem>
                                    <Divider />
                                </div>
                            )}
                        </List>
                        <Box mt={1} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button disabled={movieList.length === 0} onClick={() => {
                                setMovieList([]);
                                localStorage.removeItem('movieList');
                            }}>
                                Clear
                            </Button>
                            <Button variant='contained' disabled={movieList.length === 0} onClick={() => getRecs()}>
                                Go
                            </Button>
                        </Box>
</Card>
                    {/* </Box> */}
                </Grid>

                {/* Movie Poster */}
                <Grid item xs={7.8}>
                    {recStatus !== status.HIDDEN &&
                        <>
                            <Typography variant='h4' mb={1}>Recommended Movies</Typography>

                            {recStatus === status.LOADING ? (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                                    <CircularProgress />
                                </div>
                            ) : (
                                <GridComponent items={movieRecs} type='movie' />
                            )}
                        </>
                    }
                    {providerStatus !== status.HIDDEN &&
                        <>
                            <Typography variant='h4' mt={4} mb={1}>Recommended Providers</Typography>

                            {providerStatus === status.LOADING ? (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                                    <CircularProgress />
                                </div>
                            ) : (
                                <GridComponent items={providerRecs} type='provider' />
                            )}
                        </>
                    }
                </Grid>
            </Grid >
        </>
    );
};

export default MovieRecommendationPage;
