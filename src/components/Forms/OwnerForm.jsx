import React, { useState } from 'react';
import { Box, Button, TextField, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const OwnerForm = ({ onSubmit, owner, isEditing }) => {
    const [formState, setFormState] = useState({
        username: owner?.username || '',
        first_name: owner?.first_name || '',
        last_name: owner?.last_name || '',
        email: owner?.email || '',
        telephone: owner?.telephone || '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState({ ...formState, [name]: value });
    };

    const handlePasswordToggle = () => {
        setShowPassword(!showPassword);
    };

    const validate = () => {
        let tempErrors = {};
        if (!formState.username) tempErrors.username = "Username is required";
        if (!formState.first_name) tempErrors.first_name = "First name is required";
        if (!formState.last_name) tempErrors.last_name = "Last name is required";
        if (!formState.email) {
            tempErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
            tempErrors.email = "Email is not valid";
        }
        if (!formState.telephone) {
            tempErrors.telephone = "Telephone is required";
        } else if (!/^\+?\d{8,20}$/.test(formState.telephone)) {
            tempErrors.telephone = "Telephone must be between 8 and 20 digits and can start with a +";
        }

        if (!isEditing) {
            if (!formState.password) {
                tempErrors.password = "Password is required";
            } else if (formState.password.length < 6) {
                tempErrors.password = "Password must be at least 6 characters long";
            }
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validate()) {
            onSubmit(formState);
            setFormState({
                username: '',
                first_name: '',
                last_name: '',
                email: '',
                telephone: '',
                password: '',
            });
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            {isEditing ? (
                <TextField
                    label="Username (Read Only)"
                    name="username"
                    value={formState.username}
                    fullWidth
                    margin="normal"
                    InputProps={{
                        readOnly: true,
                    }}></TextField>

            ) : (
                <TextField
                    label="Username"
                    name="username"
                    value={formState.username}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    error={!!errors.username}
                    helperText={errors.username}
                />)}
            <TextField
                label="First Name"
                name="first_name"
                value={formState.first_name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                error={!!errors.first_name}
                helperText={errors.first_name}
            />
            <TextField
                label="Last Name"
                name="last_name"
                value={formState.last_name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                error={!!errors.last_name}
                helperText={errors.last_name}
            />
            {/* if we are editing, the Email field is read-only */}
            {isEditing ? (
                <TextField
                    label="Email (Read Only)"
                    name="email"
                    value={formState.email}
                    fullWidth
                    margin="normal"
                    InputProps={{
                        readOnly: true,
                    }}
                />
            ) : (
                <TextField
                    label="Email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    error={!!errors.email}
                    helperText={errors.email}
                />
            )}
            <TextField
                label="Telephone"
                name="telephone"
                value={formState.telephone}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                error={!!errors.telephone}
                helperText={errors.telephone}
            />
            {/* Add password field with visibility toggle, only if not editing */}
            {!isEditing && (
                <TextField
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formState.password}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    edge="end"
                                    onClick={handlePasswordToggle}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            )}
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                {isEditing ? 'Update Owner' : 'Add Owner'}
            </Button>
        </Box>
    );
};

export default OwnerForm;
