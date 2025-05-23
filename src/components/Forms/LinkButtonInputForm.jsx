import React, { useState, useRef, useEffect } from 'react';
import {
    TextField,
    Button,
    Typography,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Paper
} from '@mui/material';
import { debounce } from 'lodash';

const fonts = [
    'Arial', 'Gerogia', 'Times New Roman',
    'Courier New', 'Verdana', 'Merriweather',
    'Roboto', 'Playfair Display', 'Pacifico',
    'Alegreya', 'Great Vibes'
];

const LinkButtonInputForm = ({ onGenerateJSON, index, element }) => {
    const [buttonText, setButtonText] = useState('');
    const [textColor, setTextColor] = useState('#000000');
    const [buttonColor, setButtonColor] = useState('#ffffff');
    const [buttonSize, setButtonSize] = useState('medium');
    const [buttonLink, setButtonLink] = useState('');
    const [fontFamily, setFontFamily] = useState('Arial');

    const debouncedSetTextColor = useRef(debounce((color) => setTextColor(color), 300)).current;
    const debouncedSetButtonColor = useRef(debounce((color) => setButtonColor(color), 300)).current;

    useEffect(() => {
        if (element) {
            setButtonText(element.buttonText);
            setTextColor(element.textColor);
            setButtonColor(element.buttonColor);
            setButtonSize(element.buttonSize);
            setButtonLink(element.buttonLink);
            setFontFamily(element.fontFamily);
        }
    }, [element]);

    useEffect(() => {
        return () => {
            debouncedSetTextColor.cancel();
            debouncedSetButtonColor.cancel();
        };
    }, [debouncedSetTextColor, debouncedSetButtonColor]);

    const handleTextColorChange = (e) => {
        debouncedSetTextColor(e.target.value);
    };

    const handleButtonColorChange = (e) => {
        debouncedSetButtonColor(e.target.value);
    };

    const handleSubmit = () => {
        const jsonObject = {
            buttonText,
            textColor,
            buttonColor,
            buttonSize,
            buttonLink,
            fontFamily
        };
        onGenerateJSON(jsonObject, index);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 600, margin: 'auto' }} >
            <Typography variant="h5" gutterBottom>Link Button Styling Input Form</Typography>
            <TextField
                label="Button Text"
                fullWidth
                variant="outlined"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                sx={{ mb: 2 }}
            />
            <TextField
                label="Button Link"
                fullWidth
                variant="outlined"
                value={buttonLink}
                onChange={(e) => setButtonLink(e.target.value)}
                sx={{ mb: 2 }}
            />
            <Grid container spacing={2} alignItems="center">
                <Grid item md={3} xs={4}>
                    <TextField
                        label="Text Color"
                        fullWidth
                        variant="outlined"
                        type="color"
                        value={textColor}
                        onChange={handleTextColorChange}
                    />
                </Grid>
                <Grid item md={3} xs={5}>
                    <TextField
                        label="Button Color"
                        fullWidth
                        variant="outlined"
                        type="color"
                        value={buttonColor}
                        onChange={handleButtonColorChange}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Button Size</InputLabel>
                        <Select
                            value={buttonSize}
                            onChange={(e) => setButtonSize(e.target.value)}
                            label="Button Size"
                        >
                            <MenuItem value="small">Small</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="large">Large</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Font Family</InputLabel>
                        <Select
                            value={fontFamily}
                            onChange={(e) => setFontFamily(e.target.value)}
                            label="Font Family"
                        >
                            {fonts.map((font) => (
                                <MenuItem key={font} value={font} sx={{ fontFamily: `${font}` }}>
                                    {font}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Box display='flex' justifyContent='center' alignItems='center'>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{ mt: 2 }}
                >
                    Create Button
                </Button>
            </Box>
        </Paper >
    );
};

export default LinkButtonInputForm;
