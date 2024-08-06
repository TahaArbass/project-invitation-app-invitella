import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';

const OwnerForm = ({ onSubmit, owner, isEditing }) => {
    const [formState, setFormState] = useState({
        username: owner?.username || '',
        first_name: owner?.first_name || '',
        last_name: owner?.last_name || '',
        email: owner?.email || '',
        telephone: owner?.telephone || ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState({ ...formState, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(formState);
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <TextField
                label="Username"
                name="username"
                value={formState.username}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="First Name"
                name="first_name"
                value={formState.first_name}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Last Name"
                name="last_name"
                value={formState.last_name}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Telephone"
                name="telephone"
                value={formState.telephone}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                {isEditing ? 'Update Owner' : 'Add Owner'}
            </Button>
        </Box>
    );
};

export default OwnerForm;
