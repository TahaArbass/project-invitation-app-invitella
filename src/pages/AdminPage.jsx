// AdminPage.js
import React, { useState, useEffect } from 'react';
import CommonAppBar from '../components/CommonAppBar';
import { Box, Typography } from '@mui/material';
import Notification from '../components/Notification';
import OwnerList from '../components/Lists/OwnerList';
import { signOut, getAuth } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import baseURL from '../apiConfig';
import OwnerContainer from '../components/OwnerContainer';
import { ArrowBack } from '@mui/icons-material';
import { BackButton } from '../styles';

const AdminPage = () => {
    const [owners, setOwners] = useState([]);
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [notification, setNotification] = useState({ open: false, message: '' });
    const [loading, setLoading] = useState(true);
    const auth = getAuth(); // Initialize the Firebase Auth instance
    const { currentUser, setCurrentUser, setIsLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch owners here
        const fetchOwners = async () => {
            // get the linking table between owners and admins
            const response = await axios.get(`${baseURL}/api/admins/admin/${currentUser.dbUser.id}`);
            // get each owner from the owners table
            const ownerIds = response.data.map((link) => link.owner_id);
            const ownersRes = await Promise.all(ownerIds.map((id) => axios.get(`${baseURL}/api/users/${id}`)));
            const owners = ownersRes.map((res) => res.data);
            setOwners(owners);
            setLoading(false);
        };
        setLoading(true);
        fetchOwners();
    }, [currentUser.dbUser.id]);

    const handleProfileClick = () => {
        // Handle profile click
        setNotification({ open: true, message: 'Profile clicked' });
    };

    const handleLogoutClick = () => {
        const handleSignOut = async () => {
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
        handleSignOut();
    };

    const handleNotificationClose = () => {
        setNotification({ open: false, message: '' });
    };

    const handleEditOwner = (owner) => {
        // Handle edit owner
        setNotification({ open: true, message: `Edit owner: ${owner.username}` });
    };

    const handleDeleteOwner = (ownerId) => {
        // Handle delete owner
        setNotification({ open: true, message: `Delete owner with ID: ${ownerId}` });
        // You can implement actual delete logic here
    };

    const handleViewProjects = (owner) => {
        // set the selected owner to view their projects
        setSelectedOwner(owner);
    };

    return (
        <>
            <CommonAppBar
                userRole="Admin"
                onProfileClick={handleProfileClick}
                onLogoutClick={handleLogoutClick}
            />
            <Box sx={{ padding: 2 }}>
                {selectedOwner ? (
                    <>
                        <BackButton onClick={() => setSelectedOwner(null)}>
                            <ArrowBack />
                            <Typography variant='body1'>Back to Owners</Typography>
                        </BackButton>
                        <OwnerContainer owner={selectedOwner} />
                    </>

                ) : (
                    <>
                        <Typography variant="h4" align="center" gutterBottom>
                            Owners
                        </Typography>
                        {loading ? (
                            <Typography>Loading...</Typography>
                        ) : (
                            <OwnerList
                                owners={owners}
                                onEdit={handleEditOwner}
                                onDelete={handleDeleteOwner}
                                onViewProjects={handleViewProjects}
                            />
                        )}
                    </>
                )}
            </Box>
            <Notification
                open={notification.open}
                message={notification.message}
                onClose={handleNotificationClose}
            />
        </>
    );
};

export default AdminPage;
