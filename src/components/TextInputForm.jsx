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
    FormControlLabel,
    Checkbox,
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

const TextInputForm = ({ onGenerateJSON }) => {
    const [text, setText] = useState('');
    const [textColor, setTextColor] = useState('#000000');
    const [font, setFont] = useState('Arial');
    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [fontSize, setFontSize] = useState(16);
    const [alignment, setAlignment] = useState('left');

    const debouncedSetTextColor = useRef(debounce((color) => setTextColor(color), 300)).current;

    useEffect(() => {
        // Cancel the debounce on unmount
        return () => {
            debouncedSetTextColor.cancel();
        };
    }, [debouncedSetTextColor]);

    const handleColorChange = (e) => {
        debouncedSetTextColor(e.target.value);
    };

    const handleSubmit = () => {
        const jsonObject = {
            text,
            textColor,
            font,
            bold,
            italic,
            fontSize,
            alignment
        };
        onGenerateJSON(jsonObject);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 600, margin: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>Text Styling Input Form</Typography>
            <TextField
                label="Text"
                fullWidth
                variant="outlined"
                value={text}
                onChange={(e) => setText(e.target.value)}
                sx={{ mb: 2 }}
                multiline
                rows={4}
            />
            <Grid container spacing={2} alignItems="center">
                <Grid item md={3} xs={4}>
                    <TextField
                        label="Text Color"
                        fullWidth
                        variant="outlined"
                        type="color"
                        defaultValue={textColor}
                        onChange={handleColorChange}
                    />
                </Grid>
                <Grid item md={2} xs={3}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={bold}
                                onChange={(e) => setBold(e.target.checked)}
                            />
                        }
                        label="Bold"
                    />
                </Grid>
                <Grid item md={2} xs={3}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={italic}
                                onChange={(e) => setItalic(e.target.checked)}
                            />
                        }
                        label="Italic"
                    />
                </Grid>
                <Grid item xs={12} md={5}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Font</InputLabel>
                        <Select
                            value={font}
                            onChange={(e) => setFont(e.target.value)}
                            label="Font"
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
            <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
                <Grid item xs={6}>
                    <TextField
                        label="Font Size"
                        fullWidth
                        variant="outlined"
                        type="number"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        inputProps={{ min: 1, max: 200 }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Alignment</InputLabel>
                        <Select
                            value={alignment}
                            onChange={(e) => setAlignment(e.target.value)}
                            label="Alignment"
                        >
                            <MenuItem value="left">Left</MenuItem>
                            <MenuItem value="center">Center</MenuItem>
                            <MenuItem value="right">Right</MenuItem>
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
                    Generate JSON
                </Button>
            </Box>
        </Paper>
    );
};

export default TextInputForm;
