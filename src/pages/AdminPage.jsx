import React, { useState } from 'react';
import CommonAppBar from '../components/CommonAppBar';
import Notification from '../components/Notification';
import OwnerList from '../components/Lists/OwnerList';
import { signOut, getAuth } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MyProfile from '../components/MyProfile';
import OwnerContainer from '../components/OwnerContainer';
import ContactUs from '../components/utils/ContactUs'
import { Dialog, DialogContent } from '@mui/material';
import ConfirmAction from '../components/utils/ConfirmAction';

const AdminPage = () => {
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [notification, setNotification] = useState({ open: false, message: '' });
    const auth = getAuth(); // Initialize the Firebase Auth instance
    const { setCurrentUser, setIsLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [showProfile, setShowProfile] = useState(false);
    const [showContactUs, setShowContactUs] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleProfileClick = () => {
        setShowProfile(true);
    };

    const handleLogoutClick = () => {
        setShowConfirm(true);
    };

    const confirmLogOut = async () => {
        try {
            await signOut(auth); // Sign out the user
            setIsLoggedIn(false); // Set the isLoggedIn state to false
            setCurrentUser(null); // Set the current user to null
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

    const handleContactUsClick = () => {
        setShowContactUs(true);
    };

    return (
        <>
            <CommonAppBar
                userRole="admin"
                onProfileClick={handleProfileClick}
                onContactUsClick={handleContactUsClick}
                onLogoutClick={handleLogoutClick}
                onBackToOwnersClick={() => setSelectedOwner(null)}
            />
            <MyProfile open={showProfile} onClose={() => setShowProfile(false)} />
            <Dialog open={showContactUs} onClose={() => setShowContactUs(false)}>
                <DialogContent>
                    <ContactUs />
                </DialogContent>
            </Dialog>
            {
                selectedOwner ? (
                    <OwnerContainer owner={selectedOwner} />
                ) : (
                    <>
                        <OwnerList onViewProjects={handleViewProjects} />
                    </>
                )
            }
            <ConfirmAction
                open={showConfirm}
                title="Log Out"
                content="Are you sure you want to log out?"
                onConfirm={confirmLogOut}
                onClose={() => setShowConfirm(false)}
            />

            <Notification
                open={notification.open}
                message={notification.message}
                onClose={handleNotificationClose}
            />
        </>
    );
};

export default AdminPage;
