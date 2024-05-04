import { Autocomplete, TextField, Grid, Box } from "@mui/material";
import { useState, useMemo } from "react";
import { debounce } from '@mui/material/utils';
import { getYear } from "../utils";
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';


const MovieRecommendationPage = () => {
    const [value, setValue] = useState();
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([]);

    // Debounced function to fetch options
    const fetchOptions = useMemo(() =>
        debounce((value) => {
            fetch(`http://localhost:8080/quickSearch/${value}`)
                .then((resp) => resp.json())
                .then((data) => {
                    setOptions(data);
                });
        }
            , 10)// Adjust debounce delay as needed
        , []);



    return (
        <>
            <Autocomplete
                sx={{ width: 1000 }}
                freeSolo
                options={options}
                getOptionLabel={(option) => option.title}
                value={value}
                onChange={(event, newValue) => {
                    if (typeof newValue === 'object') {
                        setValue();
                    }
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                    if (newInputValue) {
                        fetchOptions(newInputValue);
                    } else {
                        setOptions([]);
                    }
                }}
                renderInput={(params) => (
                    <TextField {...params} label="Add a location" fullWidth />
                )}
                renderOption={(props, option, { inputValue }) => {
                    const matches = match(option.title, inputValue, { insideWords: true });
                    const parts = parse(option.title, matches);

                    return (
                        <li {...props}
                            key={option.id}
                        >
                            <Grid container alignItems="center">
                                <Grid item sx={{ display: 'flex', width: 44 }}>
                                    <Box
                                        component="img"
                                        src={`https://image.tmdb.org/t/p/original${option?.poster_path}`}
                                        elevation={3}
                                        sx={{ width: '80%' }}
                                    />
                                </Grid>
                                <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                                    {parts.map((part, index) => (
                                        <span
                                            key={index}
                                            style={{
                                                fontWeight: part.highlight ? 700 : 400,
                                            }}
                                        >
                                            {part.text}
                                        </span>
                                    ))}
                                    {option?.release_date && <i> ({getYear(option.release_date)})</i>}
                                </Grid>
                            </Grid>
                        </li>

                    );
                }}
            />
            <p>a</p><p>v</p><p>v</p><p>v</p>
            Val: {JSON.stringify(value)}
            Input Val: {inputValue}
        </>
    );
};

export default MovieRecommendationPage;
