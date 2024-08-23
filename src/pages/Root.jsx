import React from 'react';
import { Typography, Button, Box, Link, keyframes } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Phone, Email } from '@mui/icons-material';
import bgImage from '../assets/bg2.jpg';
import { Background, Container } from '../styles';

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

const slideInFromBottom = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
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

const Root = () => {
    return (
        <Background image_url={bgImage}>
            <Container sx={{ overflow: 'auto', maxHeight: '100vh' }}>
                {/* Welcome Section */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mt: 8,
                        textAlign: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark overlay
                        padding: 6,
                        borderRadius: '8px',
                        ...delayAnimation(slideInFromTop, 0.15),
                    }}
                >
                    <Typography
                        component="h1"
                        variant="h2"
                        gutterBottom
                        sx={{ color: '#fff', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}
                    >
                        Welcome to Invitella
                    </Typography>
                    <Typography
                        variant="h5"
                        gutterBottom
                        sx={{ color: '#ddd', fontWeight: '400' }}
                    >
                        The best platform for creating and managing your event invitations.
                    </Typography>
                    <Box sx={{ mt: 4 }}>
                        <Button
                            component={RouterLink}
                            to="/login"
                            variant="contained"
                            color='primary'
                            sx={{
                                mr: 2,
                                padding: '10px 20px',
                                fontSize: '16px',
                            }}
                        >
                            Login
                        </Button>
                        <Button
                            component={RouterLink}
                            to="/signup"
                            variant="contained"
                            color='secondary'
                            sx={{
                                padding: '10px 20px',
                                fontSize: '16px',
                            }}
                        >
                            Sign Up
                        </Button>
                    </Box>
                </Box>

                {/* Contact Us Section */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mt: { xs: 3, sm: 4 }, // Adjust top margin for different screen sizes
                        textAlign: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark overlay
                        padding: { xs: '20px', sm: '30px', md: '40px' }, // Responsive padding
                        borderRadius: '8px',
                        ...delayAnimation(slideInFromBottom, 1), // Animation delay for Contact Us box
                    }}
                >
                    <Typography
                        component="h2"
                        variant="h5"
                        gutterBottom
                        sx={{ color: '#fff', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}
                    >
                        Contact Us
                    </Typography>
                    <Typography
                        variant="body1"
                        gutterBottom
                        sx={{ color: 'white', mb: 2, fontWeight: '400' }}
                    >
                        If you have any questions or need assistance, please reach out to us.
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Phone color='primary' sx={{ mr: 1 }} />
                        <Link href="tel:+1234567890" sx={{ fontWeight: 'bold', '&:hover': { textDecoration: 'underline' } }}>
                            +1 (234) 567-890
                        </Link>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Email color='primary' sx={{ mr: 1 }} />
                        <Link href="mailto:support@example.com" sx={{ fontWeight: 'bold', '&:hover': { textDecoration: 'underline' } }}>
                            support@example.com
                        </Link>
                    </Box>
                </Box>

            </Container>
        </Background>
    );
};

export default Root;
