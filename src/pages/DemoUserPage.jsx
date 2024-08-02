import React from 'react';
import AppBarComponent from '../components/AppBarComponent';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DemoUserPage = () => {
    const auth = getAuth(); // Initialize the Firebase Auth instance
    const navigate = useNavigate(); // Hook to navigate programmatically
    const { setCurrentUser } = useAuth(); // Get the current user from the context

    const handleSignOut = async () => {
        try {
            await signOut(auth); // Sign out the user
            setCurrentUser(null); // Set the current user to null
            console.log('User signed out successfully');
            navigate('/login'); // Redirect to the login page after signing out
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const buttons = [
        { text: 'Home', onClick: () => console.log('Home clicked') },
        { text: 'Profile', onClick: () => console.log('Profile clicked') },
        { text: 'Settings', onClick: () => console.log('Settings clicked') },
        { text: 'Sign Out', onClick: handleSignOut },
    ];

    return <AppBarComponent title="Welcome, User!" buttons={buttons} />;
};

export default DemoUserPage;
