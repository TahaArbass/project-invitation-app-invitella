import React, { useState } from 'react';
import axios from 'axios';
import { Typography, IconButton, InputAdornment, Link, FormHelperText, Grid, keyframes } from '@mui/material';
import { Visibility, VisibilityOff, PersonAdd } from '@mui/icons-material';
import { Container, Form, StyledTextField, StyledSignButton } from '../styles';
import { Link as RouterLink } from 'react-router-dom';
import baseURL from '../apiConfig';
import Notification from '../components/Notification';
import { useNavigate } from 'react-router-dom';

// Define keyframe animations
const slideInFromTop = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const delayAnimation = (animation, delay) => ({
    animation: `${animation} 1s ease-out forwards`,
    animationDelay: `${delay}s`,
    opacity: 0,
});

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [userData, setUserData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        telephone: ''
    });
    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState({ open: false, message: '' });
    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (!userData.username) {
            newErrors.username = 'Username is required';
        }
        if (!userData.first_name) {
            newErrors.first_name = 'First name is required';
        }
        if (!userData.last_name) {
            newErrors.last_name = 'Last name is required';
        }
        if (!userData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(userData.email)) {
            newErrors.email = 'Enter a valid email address';
        }
        if (!userData.password) {
            newErrors.password = 'Password is required';
        } else if (userData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (!userData.telephone) {
            newErrors.telephone = 'Telephone number is required';
        } else if (!/^\d{8,}$/.test(userData.telephone)) {
            newErrors.telephone = 'Enter a valid telephone number';
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
        try {
            await axios.post(`${baseURL}/api/users/signup`, userData);

            // display an alert to the user

            navigate('/login');
        } catch (error) {
            setNotification({ open: true, message: 'Failed to sign up:' + error.response?.data?.error });
        }
    };

    return (
        <Container sx={{ ...delayAnimation(slideInFromTop, 0.15) }}>
            <PersonAdd color='primary' align='center' sx={{ fontSize: 50, mb: 2 }} />
            <Form noValidate onSubmit={onSubmit}>
                <Typography variant="h5" align='center' component="h1" gutterBottom>
                    Sign Up
                </Typography>
                <Grid container spacing={0.3}>
                    <Grid item xs={12}>
                        <StyledTextField
                            label="Username"
                            variant="outlined"
                            name="username"
                            fullWidth
                            required
                            value={userData.username}
                            onChange={handleChange}
                            error={!!errors.username}
                        />
                        {errors.username && (
                            <FormHelperText error>
                                {errors.username}
                            </FormHelperText>
                        )}
                    </Grid>
                    <Grid item xs={6}>
                        <StyledTextField
                            label="First Name"
                            variant="outlined"
                            name="first_name"
                            fullWidth
                            required
                            value={userData.first_name}
                            onChange={handleChange}
                            error={!!errors.first_name}
                        />
                        {errors.first_name && (
                            <FormHelperText error>
                                {errors.first_name}
                            </FormHelperText>
                        )}
                    </Grid>
                    <Grid item xs={6}>
                        <StyledTextField
                            label="Last Name"
                            variant="outlined"
                            name="last_name"
                            fullWidth
                            required
                            value={userData.last_name}
                            onChange={handleChange}
                            error={!!errors.last_name}
                        />
                        {errors.last_name && (
                            <FormHelperText error>
                                {errors.last_name}
                            </FormHelperText>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <StyledTextField
                            label="Email"
                            variant="outlined"
                            name="email"
                            fullWidth
                            required
                            value={userData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                        />
                        {errors.email && (
                            <FormHelperText error>
                                {errors.email}
                            </FormHelperText>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <StyledTextField
                            label="Password"
                            variant="outlined"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            fullWidth
                            required
                            value={userData.password}
                            onChange={handleChange}
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
                    </Grid>
                    <Grid item xs={12}>
                        <StyledTextField
                            label="Telephone"
                            variant="outlined"
                            name="telephone"
                            fullWidth
                            required
                            value={userData.telephone}
                            onChange={handleChange}
                            error={!!errors.telephone}
                        />
                        {errors.telephone && (
                            <FormHelperText error>
                                {errors.telephone}
                            </FormHelperText>
                        )}
                    </Grid>
                </Grid>
                <StyledSignButton type="submit" variant="contained" color="primary" fullWidth>
                    Sign Up
                </StyledSignButton>
                <Typography variant="body1" align="center" sx={{ mt: 1 }}>
                    Already have an account?{' '}
                    <Link component={RouterLink} to="/login">
                        Login
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

export default SignUp;
