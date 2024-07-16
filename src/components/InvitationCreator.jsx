import React, { useState } from 'react';
import { Button, Typography, Box, Paper, Grid } from '@mui/material';
import TextInputForm from './TextInputForm'; // Assume this is your text input form component

const InvitationCreator = () => {
    const [elements, setElements] = useState([]);

    const handleAddText = (jsonObject) => {
        setElements([...elements, { type: 'text', ...jsonObject }]);
    };

    const handleAddButton = (jsonObject) => {
        setElements([...elements, { type: 'button', ...jsonObject }]);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Create Your Invitation</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextInputForm onGenerateJSON={handleAddText} />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleAddButton}>
                        Add Button
                    </Button>
                </Grid>
            </Grid>
            <Paper sx={{ p: 2, mt: 3 }}>
                <Typography variant="h6">Preview</Typography>
            </Paper>
        </Box>
    );
};

export default InvitationCreator;
