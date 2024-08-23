import React, { useState } from 'react';
import CommonAppBar from '../components/CommonAppBar';
import Notification from '../components/Notification';
import SAUserList from '../components/Lists/SAUserList';
import { signOut, getAuth } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MyProfile from '../components/MyProfile';
import ContactUs from '../components/utils/ContactUs';
import { Box, Dialog, DialogContent, Tab, Tabs } from '@mui/material';
import ConfirmAction from '../components/utils/ConfirmAction';
import { Event, People } from '@mui/icons-material';

const SuperAdminPage = () => {
    const [notification, setNotification] = useState({ open: false, message: '' });
    const auth = getAuth(); // Initialize the Firebase Auth instance
    const { setCurrentUser, setIsLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [showProfile, setShowProfile] = useState(false);
    const [showContactUs, setShowContactUs] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);

    const handleProfileClick = () => {
        setShowProfile(true);
    };

    const handleLogoutClick = () => {
        setShowConfirm(true);
    };

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
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

    const handleContactUsClick = () => {
        setShowContactUs(true);
    };

    return (
        <>
            <CommonAppBar
                userRole="super admin"
                onProfileClick={handleProfileClick}
                onContactUsClick={handleContactUsClick}
                onLogoutClick={handleLogoutClick}
            />
            <MyProfile open={showProfile} onClose={() => setShowProfile(false)} />
            <Dialog open={showContactUs} onClose={() => setShowContactUs(false)}>
                <DialogContent>
                    <ContactUs />
                </DialogContent>
            </Dialog>
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <Tabs
                    value={tabIndex}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab icon={<People />} label="Users" />
                    <Tab icon={<Event />} label="Projects" />
                </Tabs>
            </Box>
            <TabPanel value={tabIndex} index={0}>
                <SAUserList />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                {/* <SAEventList /> */}
            </TabPanel>
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

function TabPanel(props) {
    const { children, value, index } = props;

    return (
        <div hidden={value !== index}>
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default SuperAdminPage;
