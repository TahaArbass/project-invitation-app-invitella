// AdminPage.js
import React, { useState, useEffect } from 'react';
import CommonAppBar from '../components/CommonAppBar';
import { Box, CircularProgress } from '@mui/material';
import Notification from '../components/Notification';
import OwnerList from '../components/Lists/OwnerList';
import { signOut, getAuth } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import baseURL from '../apiConfig';
import OwnerContainer from '../components/OwnerContainer';
import MyProfile from '../components/MyProfile';


const AdminPage = () => {
    const [owners, setOwners] = useState([]);
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [notification, setNotification] = useState({ open: false, message: '' });
    const [loading, setLoading] = useState(true);
    const auth = getAuth(); // Initialize the Firebase Auth instance
    const { currentUser, setCurrentUser, setIsLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [showProfile, setShowProfile] = useState(false);
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
        setShowProfile(true);
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

    const handleAddOrEditOwner = (owner) => {
        // add or edit the owner
        const ownerIndex = owners.findIndex((o) => o.id === owner.id);
        if (ownerIndex === -1) {
            // add the owner
            axios.post(`${baseURL}/api/users/signup`, owner)
                .then((response) => {
                    console.log('Owner added successfully:', response.data);
                    setOwners([...owners, response.data.dbUser]);
                    // add the owner to the linking table
                    axios.post(`${baseURL}/api/admins`, { owner_id: response.data.dbUser.id, admin_id: currentUser.dbUser.id });

                    setNotification({ open: true, message: 'Owner added successfully' + response.data.dbUser.username });
                })
                .catch((error) => {
                    console.error('Error adding owner:', error);
                    setNotification({ open: true, message: `Failed to add owner: ${error.response.data.error}` });
                });


        }

    };

    const handleDeleteOwner = (ownerId) => {
        // delete the owner
        axios.delete(`${baseURL}/api/users/${ownerId}`)
            .then(() => {
                setOwners(owners.filter(owner => owner.id !== ownerId));
                setNotification({ open: true, message: 'Owner deleted successfully' });
            })
            .catch((error) => {
                console.error('Error deleting owner:', error);
                setNotification({ open: true, message: 'Failed to delete owner' });
            });
    };

    const handleViewProjects = (owner) => {
        // set the selected owner to view their projects
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
                    <>
                        <OwnerContainer owner={selectedOwner} />
                    </>

                ) : (
                    <>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>
                        ) : (
                            <OwnerList
                                owners={owners}
                                onAddOrEdit={handleAddOrEditOwner}
                                onDelete={handleDeleteOwner}
                                onViewProjects={handleViewProjects}
                            />
                        )}
                    </>
                )})
            <Notification
                open={notification.open}
                message={notification.message}
                onClose={handleNotificationClose}
            />
        </>
    );
};

export default AdminPage;
