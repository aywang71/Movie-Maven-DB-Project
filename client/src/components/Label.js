import { Box, Typography } from "@mui/material";

import { useTheme } from "@emotion/react";

const Label = ({ text, styles, background, m, mr, ml, mt, mb }) => {
    const theme = useTheme();

    return (
        <Box 
            display='inline-block' 
            sx={{ 
                background: background || theme.palette.primary.main, 
                pl: 1, 
                pr: 1,
                borderRadius: '4px',
                m: m,
                mr: mr,
                ml: ml,
                mt: mt,
                mb: mb,
            }}
        >
            <Typography variant="label" sx={styles}>{text}</Typography>
        </Box>
    );
};

export default Label;
