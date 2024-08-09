import React, { useState } from 'react';
import CommonAppBar from '../components/CommonAppBar';
import Notification from '../components/Notification';
import OwnerList from '../components/Lists/OwnerList';
import { signOut, getAuth } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MyProfile from '../components/MyProfile';
import OwnerContainer from '../components/OwnerContainer';

const AdminPage = () => {
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [notification, setNotification] = useState({ open: false, message: '' });
    const auth = getAuth(); // Initialize the Firebase Auth instance
    const { setCurrentUser, setIsLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [showProfile, setShowProfile] = useState(false);

    const handleProfileClick = () => {
        setShowProfile(true);
    };

    const handleLogoutClick = async () => {
        try {
            await signOut(auth); // Sign out the user
            setIsLoggedIn(false); // Set the isLoggedIn state to false
            setCurrentUser(null); // Set the current user to null
            console.log('User signed out successfully');
            navigate('/login'); // Redirect to the login page after signing out
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleNotificationClose = () => {
        setNotification({ open: false, message: '' });
    };

    const handleViewProjects = (owner) => {
        setSelectedOwner(owner);
    };

    return (
        <>
            <CommonAppBar
                userRole="admin"
                onProfileClick={handleProfileClick}
                onLogoutClick={handleLogoutClick}
                onBackToOwnersClick={() => setSelectedOwner(null)}
            />
            <MyProfile open={showProfile} onClose={() => setShowProfile(false)} />
            {
                selectedOwner ? (
                    <OwnerContainer owner={selectedOwner} />
                ) : (
                    <>
                        <OwnerList onViewProjects={handleViewProjects} />
                    </>
                )
            }
            <Notification
                open={notification.open}
                message={notification.message}
                onClose={handleNotificationClose}
            />
        </>
    );
};

export default AdminPage;
