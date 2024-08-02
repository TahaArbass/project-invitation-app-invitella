import React from 'react';
import { Container, Typography, Button, Box, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Root = () => {
    return (
        <Container component="main" maxWidth="md">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 8,
                    textAlign: 'center',
                }}
            >
                <Typography component="h1" variant="h2" gutterBottom>
                    Welcome to Project Invitation
                </Typography>
                <Typography variant="h5" gutterBottom>
                    The best platform for creating and managing your event invitations.
                </Typography>
                <Box sx={{ mt: 4 }}>
                    <Button
                        component={RouterLink}
                        to="/login"
                        variant="contained"
                        color="primary"
                        sx={{ mr: 2 }}
                    >
                        Login
                    </Button>
                    <Button
                        component={RouterLink}
                        to="/signup"
                        variant="contained"
                        color="primary"
                    >
                        Sign Up
                    </Button>
                </Box>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 8,
                    textAlign: 'center',
                    borderTop: '2px solid #ddd',
                    pt: 4,
                }}
            >
                <Typography component="h2" variant="h5" gutterBottom>
                    Contact Us
                </Typography>
                <Typography variant="body1" gutterBottom>
                    If you have any questions or need assistance, please reach out to us.
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Phone Number: <a href="tel:+1234567890">+1 (234) 567-890</a>
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    Email: <Link href="mailto:support@example.com">support@example.com</Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default Root;
