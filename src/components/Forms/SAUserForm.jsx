import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, MenuItem } from '@mui/material';

const roles = [
    { value: 'admin', label: 'Admin' },
    { value: 'owner', label: 'Owner' },
    { value: 'superadmin', label: 'Super Admin' },
];

const SAUserForm = ({ onSubmit, user, isEditing, onCancel }) => {
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        password: '',
        telephone: '',
        email: '',
        role: 'admin',
        isActivated: true,
    });

    useEffect(() => {
        if (isEditing && user) {
            setFormData({
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                telephone: user.telephone,
                email: user.email,
                role: user.role,
                isActivated: user.isActivated,
            });
        }
    }, [isEditing, user]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(formData);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                    label="First Name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                />
            </Box>
            <TextField
                label="Telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                required
            />
            {isEditing ? (<TextField
                label="Email (Read Only)"
                name="email"
                value={formData.email}
                aria-readonly={true}
                type="email"
            />) : (<TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
            />)}
            <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                    select
                    label="Role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                >
                    {roles.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    label="Status"
                    name="isActivated"
                    value={formData.isActivated}
                    onChange={handleChange}
                    required
                >
                    <MenuItem value={true}>Active</MenuItem>
                    <MenuItem value={false}>Inactive</MenuItem>
                </TextField>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button type="submit" variant="contained" color="primary">
                    {isEditing ? 'Save Changes' : 'Add User'}
                </Button>
                <Button variant="contained" color="secondary" onClick={onCancel}>
                    Cancel
                </Button>
            </Box>
        </Box>
    );
};

export default SAUserForm;
