import React, { useState, useEffect, useRef } from 'react';
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
import { Home, LocationOn, Event, NotInterested } from '@mui/icons-material';

const Icons = {
    Home,
    LocationOn,
    Event,
    NotInterested
};

const IconInputForm = ({ onGenerateJSON, index, element }) => {
    const [iconType, setIconType] = useState('Home');
    const [iconColor, setIconColor] = useState('#000000');
    const [iconSize, setIconSize] = useState(24);

    const debouncedSetIconColor = useRef(debounce((color) => setIconColor(color), 300)).current;

    useEffect(() => {
        if (element) {
            setIconType(element.iconType);
            setIconColor(element.iconColor);
            setIconSize(element.iconSize);
        }
    }, [element]);

    useEffect(() => {
        return () => {
            debouncedSetIconColor.cancel();
        };
    }, [debouncedSetIconColor]);

    const handleIconColorChange = (e) => {
        debouncedSetIconColor(e.target.value);
    };

    const handleSubmit = () => {
        const jsonObject = {
            iconType,
            iconColor,
            iconSize
        };
        onGenerateJSON(jsonObject, index);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 600, margin: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>Icon Styling Input Form</Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Icon Type</InputLabel>
                        <Select
                            value={iconType}
                            onChange={(e) => setIconType(e.target.value)}
                            label="Icon Type"
                            renderValue={(selected) => (
                                <Box display="flex" alignItems="center">
                                    {React.createElement(Icons[selected], {
                                        style: { marginRight: 8 }
                                    })}
                                    {selected}
                                </Box>
                            )}
                        >
                            {Object.keys(Icons).map((iconName) => (
                                <MenuItem key={iconName} value={iconName}>
                                    <Box display="flex" alignItems="center">
                                        {React.createElement(Icons[iconName], {
                                            style: { marginRight: 8 }
                                        })}
                                        {iconName}
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Icon Color"
                        fullWidth
                        variant="outlined"
                        type="color"
                        defaultValue={iconColor}
                        onChange={handleIconColorChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Icon Size"
                        fullWidth
                        variant="outlined"
                        type="number"
                        value={iconSize}
                        onChange={(e) => setIconSize(Number(e.target.value))}
                        inputProps={{ min: 1, max: 200 }}
                    />
                </Grid>
            </Grid>
            <Box display='flex' justifyContent='center' alignItems='center'>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{ mt: 2 }}
                >
                    Create Icon
                </Button>
            </Box>
        </Paper>
    );
};

export default IconInputForm;
