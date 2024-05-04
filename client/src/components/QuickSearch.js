import { Autocomplete, TextField, Grid, Box, Divider, CircularProgress } from "@mui/material";
import { useState, useMemo } from "react";
import { debounce } from '@mui/material/utils';
import { getYear } from "../utils";
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';


const QuickSearch = ({ sendValue, ...extra }) => {
    const [searchValue, setSearchValue] = useState(null);
    const [searchInputValue, setSearchInputValue] = useState('');
    const [searchOptions, setSearchOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Debounced function to fetch options
    const fetchOptions = useMemo(() =>
        debounce((value) => {
            setLoading(true);
            fetch(`http://localhost:8080/quickSearch/${value}`)
                .then((resp) => resp.json())
                .then((data) => {
                    setSearchOptions(data);
                })
                .finally(() => setLoading(false));
        }
            , 10)
        , []);


    return (
        <Autocomplete
            {...extra}
            clearOnEscape
            open={isOpen}
            onOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
            clearOnBlur
            loading={loading}
            options={searchOptions}
            getOptionLabel={(option) => option.title}
            value={searchValue}
            isOptionEqualToValue={(option, value) => !!option.id}
            onChange={(event, newValue) => {
                if (newValue) {
                    sendValue(newValue);
                    // setSearchValue(newValue);
                    setSearchInputValue('');
                    setSearchOptions([]);
                }
            }}
            inputValue={searchInputValue}
            onInputChange={(event, newInputValue) => {
                setSearchInputValue(newInputValue);
                if (newInputValue) {
                    fetchOptions(newInputValue);
                } else {
                    setSearchOptions([]);
                }
            }}
            renderInput={(params) => (
                <TextField {...params} label="Add a movie" fullWidth InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                        <>
                            {loading && isOpen ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                        </>
                    ),
                }} />
            )}
            renderOption={(props, option, { inputValue }) => {
                const matches = match(option.title, inputValue, { insideWords: true });
                const parts = parse(option.title, matches);

                return (
                    <div key={option.id}>
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
                        {option.id !== searchOptions[searchOptions.length - 1].id && <Divider />}
                    </div>
                );
            }}
        />
    );
};

export default QuickSearch;
