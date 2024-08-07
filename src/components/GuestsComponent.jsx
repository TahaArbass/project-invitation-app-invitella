import React from 'react';
import GuestList from './Lists/GuestList';
import { Box } from '@mui/material';
const Guests = () => {
    return (
        <Box sx={{ p: 0.3 }}>
            <GuestList />
        </Box>
    );
};

export default Guests;
