// src/pages/ForgotPassword.js
import React, { useState } from 'react';
import { TextField, Button, Typography, FormHelperText } from '@mui/material';
import axios from 'axios';
import baseURL from '../apiConfig';
import { Container, Form } from '../styles';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await axios.post(`${baseURL}/api/users/forgot-password`, { email });
            if (response.status !== 200) {
                throw new Error('Failed to send password reset email.');
            }
            setSuccess('Password reset email sent successfully.');
        } catch (err) {
            setError('Failed to send password reset email. Please check the email address and try again.');
        }
    };

    return (
        <Container>
            <Form>
                <Typography align='center' component="h1" variant="h5">
                    Forgot Password
                </Typography>
                <form noValidate onSubmit={handlePasswordReset} style={{ width: '100%', marginTop: '1rem' }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!error}
                    />
                    {error && <FormHelperText error>{error}</FormHelperText>}
                    {success && <FormHelperText>{success}</FormHelperText>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Send Password Reset Link
                    </Button>
                </form>
            </Form>
        </Container >
    );
};

export default ForgotPassword;
