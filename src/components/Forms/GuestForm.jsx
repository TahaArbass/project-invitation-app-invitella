import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useProject } from '../OwnerContainer';

const GuestForm = ({ onSubmit, guest, isEditing }) => {
    const { selectedProject } = useProject();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        telephone: '',
        rsvp_status: 'pending', // Set default value
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (guest) {
            setFormData({
                first_name: guest.first_name,
                last_name: guest.last_name,
                telephone: guest.telephone,
                rsvp_status: guest.rsvp_status || 'pending', // Set default if guest data is missing
            });
        }
    }, [guest]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validate = () => {
        let tempErrors = {};
        if (!formData.first_name || formData.first_name.length < 3) {
            tempErrors.first_name = "First name must be at least 3 characters long.";
        }
        if (!formData.last_name || formData.last_name.length < 3) {
            tempErrors.last_name = "Last name must be at least 3 characters long.";
        }
        if (!/^\+?[0-9]+$/.test(formData.telephone)) {
            tempErrors.telephone = "Telephone must be a number and can optionally start with a '+'.";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
            setFormData({
                first_name: '',
                last_name: '',
                telephone: '',
                rsvp_status: 'pending',  // Reset to default value
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
                error={!!errors.first_name}
                helperText={errors.first_name}
            />
            <TextField
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
                error={!!errors.last_name}
                helperText={errors.last_name}
            />
            <TextField
                label="Telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.telephone}
                helperText={errors.telephone}
            />
            <FormControl fullWidth margin="normal" required>
                <InputLabel>RSVP Status</InputLabel>
                <Select
                    name="rsvp_status"
                    value={formData.rsvp_status}
                    onChange={handleChange}
                    label="RSVP Status"
                >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="confirmed">Confirmed</MenuItem>
                    <MenuItem value="declined">Declined</MenuItem>
                </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary">
                {isEditing ? 'Update Guest' : 'Add Guest'}
            </Button>
        </form>
    );
};

export default GuestForm;
