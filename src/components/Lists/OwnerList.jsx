import React, { useEffect, useState } from 'react';
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
    Paper, Button, Dialog, DialogContent, DialogTitle, IconButton, Typography, CircularProgress
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import axios from 'axios';
import baseURL from '../../apiConfig';
import OwnerForm from '../Forms/OwnerForm';
import Notification from '../Notification';
import ConfirmAction from '../utils/ConfirmAction';
import { useAuth } from '../../context/AuthContext';

const OwnerList = ({ onViewProjects }) => {
    const [owners, setOwners] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [editingOwner, setEditingOwner] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ open: false, message: '' });
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deleteOwnerId, setDeleteOwnerId] = useState(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchOwners = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${baseURL}/api/admins/admin/${currentUser.dbUser.id}`);
                const ownerIds = response.data.map((link) => link.owner_id);
                const ownersRes = await Promise.all(ownerIds.map((id) => axios.get(`${baseURL}/api/users/${id}`)));
                setOwners(ownersRes.map((res) => res.data));
            } catch (error) {
                console.error('Error fetching owners:', error);
                setNotification({ open: true, message: 'Failed to fetch owners' });
            } finally {
                setLoading(false);
            }
        };

        fetchOwners();
    }, [currentUser.dbUser.id]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
        setEditingOwner(null);
    };

    const handleAddOrEdit = async (owner) => {
        try {
            if (editingOwner) {
                await axios.put(`${baseURL}/api/users/${editingOwner.id}`, owner);
                setOwners(owners.map((o) => (o.id === editingOwner.id ? { ...o, ...owner } : o)));
                setNotification({ open: true, message: 'Owner edited successfully' });
            } else {
                const response = await axios.post(`${baseURL}/api/users/signup`, owner); // Use signup endpoint
                await axios.post(`${baseURL}/api/admins`, { owner_id: response.data.dbUser.id, admin_id: currentUser.dbUser.id }); // Add owner to admin
                setOwners([...owners, response.data.dbUser]);
                setNotification({ open: true, message: `Owner added successfully: ${response.data.dbUser.username}` });
            }
        } catch (error) {
            setNotification({ open: true, message: `Failed to process owner: ${error.response.data.error}` });
        } finally {
            // first set the form visibility to false then after it is closed, set the editing owner to null
            setIsFormVisible(false);
            setEditingOwner(null);
        }
    };

    const handleEditClick = (owner) => {
        setEditingOwner(owner);
        setIsFormVisible(true);
    };

    const handleDelete = (ownerId) => {
        setIsConfirmOpen(true);
        setDeleteOwnerId(ownerId);
    };

    const confirmDeleteOwner = async () => {
        try {
            await axios.delete(`${baseURL}/api/users/${deleteOwnerId}`);
            setOwners(owners.filter(owner => owner.id !== deleteOwnerId));
            setNotification({ open: true, message: 'Owner deleted successfully' });
        } catch (error) {
            console.error('Error deleting owner:', error);
            setNotification({ open: true, message: 'Failed to delete owner' });
        } finally {
            setIsConfirmOpen(false);
            setDeleteOwnerId(null);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant='h4' align='center' fontWeight='bold' gutterBottom>
                Owners
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Button onClick={toggleFormVisibility} variant="contained" color="primary">
                    <Add />
                    {isFormVisible ? 'Close Form' : 'Add Owner'}
                </Button>
            </Box>
            <Dialog open={isFormVisible} onClose={toggleFormVisibility}>
                <DialogTitle>{editingOwner ? 'Edit Owner' : 'Add Owner'}</DialogTitle>
                <DialogContent>
                    <OwnerForm onSubmit={handleAddOrEdit} owner={editingOwner} isEditing={Boolean(editingOwner)} onCancel={toggleFormVisibility} />
                </DialogContent>
            </Dialog>
            <TableContainer component={Paper} sx={{ boxShadow: 4, borderRadius: 3 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: 'bisque' }}>
                        <TableRow>
                            <TableCell><Typography>Username</Typography></TableCell>
                            <TableCell><Typography>First Name</Typography></TableCell>
                            <TableCell><Typography>Last Name</Typography></TableCell>
                            <TableCell><Typography>Email</Typography></TableCell>
                            <TableCell><Typography>Telephone</Typography></TableCell>
                            <TableCell><Typography>Actions</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {owners.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6}>
                                    <Typography variant="body2" color="textSecondary" align="center">
                                        No owners found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            owners.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((owner) => (
                                <TableRow key={owner.id} sx={{ '&:hover': { backgroundColor: 'beige' } }}>
                                    <TableCell>{owner.username}</TableCell>
                                    <TableCell>{owner.first_name}</TableCell>
                                    <TableCell>{owner.last_name}</TableCell>
                                    <TableCell>{owner.email}</TableCell>
                                    <TableCell>{owner.telephone}</TableCell>
                                    <TableCell>
                                        <Box display="flex" gap={1}>
                                            <IconButton onClick={() => { handleEditClick(owner) }} sx={{ '&:hover': { color: 'blue' } }}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton color='warning' onClick={() => handleDelete(owner.id)} sx={{ '&:hover': { color: 'red' } }}>
                                                <Delete />
                                            </IconButton>
                                            <Button color='secondary' onClick={() => onViewProjects(owner)}>View Projects</Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={owners.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <ConfirmAction
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDeleteOwner}
                title="Confirm Delete"
                content="Are you sure you want to delete this owner? This action cannot be undone."
            />
            <Notification
                open={notification.open}
                message={notification.message}
                onClose={() => setNotification({ open: false, message: '' })}
            />
        </Box>
    );
};

export default OwnerList;
