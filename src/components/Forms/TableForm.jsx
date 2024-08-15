import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';

const TableForm = ({ onSubmit, table, isEditing, onCancel }) => {
    const [formState, setFormState] = useState({
        label: table?.label || '',
        description: table?.description || '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState({ ...formState, [name]: value });
    };

    const validate = () => {
        let tempErrors = {};
        if (!formState.label) tempErrors.label = "Label is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validate()) {
            onSubmit(formState);
            setFormState({
                label: '',
                description: '',
            });
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
                label="Table Label"
                name="label"
                value={formState.label}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                error={!!errors.label}
                helperText={errors.label}
            />
            <TextField
                label="Description (Optional)"
                name="description"
                value={formState.description}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                rows={4}
            />
            <Box sx={{ mt: 2 }}>
                <Button type="submit" variant="contained" color="primary">
                    {isEditing ? 'Update Table' : 'Add Table'}
                </Button>
                <Button variant="contained" color="secondary" sx={{ ml: 2 }} onClick={onCancel}>
                    Cancel
                </Button>
            </Box>
        </Box>
    );
};

export default TableForm;
