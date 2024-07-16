import React from 'react';
import { Typography, Box } from '@mui/material';

const DisplayComponent = ({ jsonObject }) => {
    const { text, textColor, font, bold, italic, fontSize, alignment } = jsonObject;

    const style = {
        color: textColor,
        fontFamily: font,
        fontWeight: bold ? 'bold' : 'normal',
        fontStyle: italic ? 'italic' : 'normal',
        fontSize: `${fontSize}px`,
        textAlign: alignment,
        border: '1px solid #ddd',
        padding: '10px',
        borderRadius: '5px',
        whiteSpace: 'pre-wrap',
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography style={style}>{text}</Typography>
        </Box>
    );
};

export default DisplayComponent;
