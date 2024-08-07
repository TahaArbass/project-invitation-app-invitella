import React, { useState } from 'react';
import axios from 'axios';
import { Typography, IconButton, InputAdornment, Link, FormHelperText } from '@mui/material';
import { Visibility, VisibilityOff, LockOpen } from '@mui/icons-material';
import { Container, Form, StyledTextField, StyledSignButton } from '../styles';
import { Link as RouterLink } from 'react-router-dom';
import baseURL from '../apiConfig';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Notification from '../components/Notification';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    var { currentUser, setCurrentUser } = useAuth();
    const [notification, setNotification] = useState({ open: false, message: '' });

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const validate = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)) {
            newErrors.email = 'Enter a valid email address';
        } else {
            delete newErrors.email; // Remove error if valid
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        } else {
            delete newErrors.password; // Remove error if valid
        }

        return newErrors;
    };


    const onSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        // Clear errors on successful submission
        setErrors({});

        const data = { email, password };
        try {
            const response = await axios.post(`${baseURL}/api/users/login`, data);
            if (response.status !== 200) {
                throw new Error('Failed to login.');
            }

            setCurrentUser(response.data);
            // Redirect to home page based on role
            navigate('/' + currentUser.dbUser.role + '/home');

        } catch (error) {
            setNotification({ open: true, message: 'Please check your email and password.' + error.response?.data?.error });
        }
    }

    return (
        <Container>
            <LockOpen color='primary' sx={{ fontSize: 50, mb: 2 }} />
            <Form noValidate onSubmit={onSubmit}>
                <Typography variant="h5" align='center' component="h1" gutterBottom>
                    Login
                </Typography>
                <StyledTextField
                    label="Email"
                    variant="outlined"
                    type="email"
                    fullWidth
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!errors.email}
                />
                {errors.email && (
                    <FormHelperText error>
                        {errors.email}
                    </FormHelperText>
                )}
                <StyledTextField
                    label="Password"
                    variant="outlined"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!errors.password}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                {errors.password && (
                    <FormHelperText error>
                        {errors.password}
                    </FormHelperText>
                )}
                <StyledSignButton type="submit" variant="contained" color="primary" fullWidth>
                    Login
                </StyledSignButton>
                <Typography variant="body1" align="center">
                    <Link component={RouterLink} to="/forgot-password">
                        Forgot Password?
                    </Link>
                </Typography>
                <Typography variant="body1" align="center" sx={{ mt: 1 }}>
                    Don't have an account?{' '}
                    <Link component={RouterLink} to="/signup">
                        Sign Up
                    </Link>
                </Typography>
            </Form>
            <Notification
                open={notification.open}
                message={notification.message}
                onClose={() => setNotification({ open: false, message: '' })}
            />
        </Container>
    );
};

export default Login;
