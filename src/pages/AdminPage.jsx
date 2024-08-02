// AdminPage.js
import React, { useState, useEffect } from 'react';
import CommonAppBar from '../components/CommonAppBar';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import OwnerProjects from '../components/OwnerProjects';
import Notification from '../components/Notification';

const AdminPage = () => {
    const [owners, setOwners] = useState([]);
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [notification, setNotification] = useState({ open: false, message: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch owners here
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setOwners([
                { id: 1, name: 'Owner1' },
                { id: 2, name: 'Owner2' },
                // Add more owners
            ]);
        }, 1000);
    }, []);

    const handleOwnerClick = (owner) => {
        setSelectedOwner(owner);
    };

    const handleProfileClick = () => {
        // Handle profile click
        setNotification({ open: true, message: 'Profile clicked' });
    };

    const handleLogoutClick = () => {
        // Handle logout
        setNotification({ open: true, message: 'Logged out' });
    };

    const handleNotificationClose = () => {
        setNotification({ open: false, message: '' });
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
                    <OwnerProjects owner={selectedOwner} />
                ) : (
                    <>
                        <Typography variant="h4" align="center" gutterBottom>
                            Owners
                        </Typography>
                        {loading ? (
                            <Typography>Loading...</Typography>
                        ) : (
                            <List>
                                {owners.length > 0 ? (
                                    owners.map((owner) => (
                                        <ListItem button onClick={() => handleOwnerClick(owner)} key={owner.id}>
                                            <ListItemText primary={owner.name} />
                                        </ListItem>
                                    ))
                                ) : (
                                    <Typography>No owners available</Typography>
                                )}
                            </List>
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
