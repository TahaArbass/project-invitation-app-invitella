import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CommonAppBar from '../components/CommonAppBar';
import OwnerContainer from '../components/OwnerContainer';
import Notification from '../components/Notification';
import { getAuth, signOut } from 'firebase/auth';
import { Box } from '@mui/material';

const OwnerPage = () => {
    const { currentUser, setCurrentUser, setIsLoggedIn } = useAuth();
    const [notification, setNotification] = useState({ open: false, message: '' });
    const navigate = useNavigate();
    const auth = getAuth(); // Initialize the Firebase Auth instance

    const handleProfileClick = () => {
        setNotification({ open: true, message: 'Profile clicked' });
    };

    const handleLogoutClick = () => {
        const handleSignOut = async () => {
            try {
                await signOut(auth); // Sign out the user
                setIsLoggedIn(false); // Set the isLoggedIn state to false
                setCurrentUser(null); // Set the current user to null
                navigate('/login'); // Redirect to the login page after signing out
            } catch (error) {
                console.error('Error signing out:', error);
            }
        };
        handleSignOut();
    };

    const handleNotificationClose = () => {
        setNotification({ open: false, message: '' });
    };

    return (
        <Box>
            <CommonAppBar
                userRole="Owner"
                onProfileClick={handleProfileClick}
                onLogoutClick={handleLogoutClick}
            />
            <OwnerContainer owner={currentUser.dbUser} />
            <Notification open={notification.open} message={notification.message} onClose={handleNotificationClose} />
        </Box>
    );
};

export default OwnerPage;
