import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ConfirmAction from './utils/ConfirmAction';
import Notification from './Notification';
import axios from 'axios';
import baseURL from '../apiConfig';
import { useAuth } from '../context/AuthContext';
import OwnerForm from './Forms/OwnerForm';

const MyProfile = ({ open, onClose }) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '' });
    const [userData, setUserData] = useState({ username: '', email: '', first_name: '', last_name: '', telephone: '' });
    const { currentUser, setIsLoggedIn, setCurrentUser } = useAuth();
    const [isFormVisible, setIsFormVisible] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setUserData({
                username: currentUser.dbUser.username,
                email: currentUser.dbUser.email,
                first_name: currentUser.dbUser.first_name,
                last_name: currentUser.dbUser.last_name,
                telephone: currentUser.dbUser.telephone
            });
        }
    }, [currentUser]);

    const handleDeleteClick = () => {
        setIsConfirmOpen(true);
    };

    const confirmDeleteAccount = async () => {
        try {
            // Call backend to handle account deletion
            await axios.delete(`${baseURL}/api/users/${currentUser.dbUser.id}`);
            setIsLoggedIn(false);
            setCurrentUser(null);
            // Notify and log out the user
            setNotification({ open: true, message: 'Account deleted successfully' });
            setIsLoggedIn(false);
            setCurrentUser(null);
        } catch (error) {
            console.error('Failed to delete account:', error);
            setNotification({ open: true, message: 'Failed to delete account' });
        } finally {
            setIsConfirmOpen(false);
        }
    };

    const handleConfirmClose = () => {
        setIsConfirmOpen(false);
    };

    const handleEditClick = () => {
        setIsFormVisible(true);
    };

    const editAccount = async (data) => {
        try {
            await axios.put(`${baseURL}/api/users/${currentUser.dbUser.id}`, data);
            setUserData(data);
            // set the current user to the updated user, only the changed data is updated
            setCurrentUser({ ...currentUser, dbUser: { ...currentUser.dbUser, ...data } });
            setNotification({ open: true, message: 'Profile updated successfully' });
        } catch (error) {
            setNotification({ open: true, message: 'Failed to update profile' + error.response.data.error });
        } finally {
            setIsFormVisible(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>My Profile</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1">Username</Typography>
                    <TextField
                        value={userData.username}
                        fullWidth
                        margin='none'
                        size='small'
                        InputProps={{
                            readOnly: true,
                        }}
                        sx={{ mb: 2 }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">First Name</Typography>
                    <TextField
                        value={userData.first_name}
                        fullWidth
                        margin='none'
                        size='small'
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">Last Name</Typography>
                    <TextField
                        value={userData.last_name}
                        fullWidth
                        margin='none'
                        size='small'
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">Email</Typography>
                    <TextField
                        value={userData.email}
                        fullWidth
                        margin='none'
                        size='small'
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Box>
                <Box>
                    <Typography variant="subtitle1">Telephone</Typography>
                    <TextField
                        value={userData.telephone}
                        fullWidth
                        margin='none'
                        size='small'
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="warning" onClick={handleDeleteClick} sx={{ mr: 2 }}>
                    Delete Account
                </Button>
                <Button variant="contained" color="info" onClick={handleEditClick} sx={{ mr: 2 }}>
                    Edit Profile
                </Button>
                <Button onClick={onClose} color="secondary">
                    Close
                </Button>
            </DialogActions>

            <ConfirmAction
                open={isConfirmOpen}
                onClose={handleConfirmClose}
                onConfirm={confirmDeleteAccount}
                title="Confirm Deletion"
                content="Are you sure you want to delete your account? This action cannot be undone."
            />
            <Dialog open={isFormVisible} onClose={() => { setIsFormVisible(false) }}>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <OwnerForm onSubmit={editAccount} owner={currentUser.dbUser} isEditing={true} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setIsFormVisible(false) }} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Notification
                open={notification.open}
                message={notification.message}
                onClose={() => setNotification({ open: false, message: '' })}
            />
        </Dialog>
    );
};

export default MyProfile;
