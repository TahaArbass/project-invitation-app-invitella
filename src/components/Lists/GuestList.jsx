import React, { useEffect, useState } from 'react';
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
    Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, CircularProgress
} from '@mui/material';
import axios from 'axios';
import baseURL from '../../apiConfig';
import GuestForm from '../Forms/GuestForm';
import { useProject } from '../OwnerContainer';
import { Delete, Edit, Add } from '@mui/icons-material';
import Notification from '../Notification';
import ConfirmAction from '../utils/ConfirmAction';

const GuestList = () => {
    const [guests, setGuests] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [editingGuest, setEditingGuest] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ open: false, message: '' });
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deleteGuestId, setDeleteGuestId] = useState(null);

    const { selectedProject } = useProject();

    useEffect(() => {
        const fetchGuests = async () => {
            if (!selectedProject?.id) return;
            setLoading(true);
            try {
                const response = await axios.get(`${baseURL}/api/guests/project/${selectedProject.id}`);
                setGuests(response.data);
            } catch (error) {
                console.error('Error fetching guest list:', error);
                setNotification({ open: true, message: 'Failed to fetch guests' });
            } finally {
                setLoading(false);
            }
        };
        fetchGuests();
    }, [selectedProject?.id]);

    const handleAddOrEditGuest = async (guest) => {
        let response;
        try {
            if (editingGuest) {
                response = await axios.put(`${baseURL}/api/guests/${editingGuest.id}`, guest);
                setGuests(guests.map(g => (g.id === editingGuest.id ? { ...g, ...guest } : g)));
            } else {
                guest.project_id = selectedProject.id;
                response = await axios.post(`${baseURL}/api/guests`, guest);
                setGuests([...guests, response.data]);
            }
        } catch (error) {
            console.error('Error saving guest:', error);
            setNotification({ open: true, message: 'Failed to save guest' });
        } finally {
            setIsFormVisible(false);
            setEditingGuest(null);
        }
    };

    const handleEditClick = (guest) => {
        setEditingGuest(guest);
        setIsFormVisible(true);
    };

    const handleDeleteClick = (guestId) => {
        setIsConfirmOpen(true);
        setDeleteGuestId(guestId);
    };

    const confirmDeleteGuest = async (guestId) => {
        try {
            await axios.delete(`${baseURL}/api/guests/${guestId}`);
            setGuests(guests.filter(guest => guest.id !== guestId));
            setNotification({ open: true, message: 'Guest deleted successfully' });
            setIsConfirmOpen(false);
            setDeleteGuestId(null);
        } catch (error) {
            console.error('Error deleting guest:', error);
            setNotification({ open: true, message: 'Failed to delete guest' });
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
        setEditingGuest(null);
    };

    const getRSVPStatusStyles = (status) => {
        switch (status) {
            case 'confirmed':
                return { backgroundColor: 'lightgreen', color: 'darkgreen' };
            case 'pending':
                return { backgroundColor: 'lightyellow', color: 'darkgoldenrod' };
            case 'declined':
                return { backgroundColor: 'lightcoral', color: 'darkred' };
            default:
                return {};
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
                Guests
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Button onClick={toggleFormVisibility} variant="contained" color="primary">
                    <Add />
                    {isFormVisible ? 'Close Form' : 'Add Guest'}
                </Button>
            </Box>
            <Dialog open={isFormVisible} onClose={toggleFormVisibility}>
                <DialogTitle>{editingGuest ? 'Edit Guest' : 'Add Guest'}</DialogTitle>
                <DialogContent>
                    <GuestForm onSubmit={handleAddOrEditGuest} guest={editingGuest} isEditing={Boolean(editingGuest)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleFormVisibility} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <TableContainer component={Paper} sx={{ boxShadow: 4, borderRadius: 3 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: 'bisque' }}>
                        <TableRow>
                            <TableCell><Typography>First Name</Typography></TableCell>
                            <TableCell><Typography>Last Name</Typography></TableCell>
                            <TableCell><Typography>Telephone</Typography></TableCell>
                            <TableCell><Typography>RSVP Status</Typography></TableCell>
                            <TableCell><Typography>Actions</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {guests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <Typography variant="body2" color="textSecondary" align="center">
                                        No guests found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            guests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((guest, index) => (
                                <TableRow key={index} sx={{ '&:hover': { backgroundColor: 'beige' } }}>
                                    <TableCell>{guest.first_name}</TableCell>
                                    <TableCell>{guest.last_name}</TableCell>
                                    <TableCell>{guest.telephone}</TableCell>
                                    <TableCell sx={{ ...getRSVPStatusStyles(guest.rsvp_status), width: '15%' }}>
                                        {guest.rsvp_status}
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" gap={1}>
                                            <IconButton onClick={() => handleEditClick(guest)} sx={{ '&:hover': { color: 'blue' } }}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton color='warning' onClick={() => handleDeleteClick(guest.id)} sx={{ '&:hover': { color: 'red' } }}>
                                                <Delete />
                                            </IconButton>
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
                count={guests.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <ConfirmAction
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={() => confirmDeleteGuest(deleteGuestId)}
                title="Confirm Delete"
                content="Are you sure you want to delete this guest? This action cannot be undone."
            />
            <Notification
                open={notification.open}
                message={notification.message}
                onClose={() => setNotification({ open: false, message: '' })}
            />
        </Box>
    );
};

export default GuestList;
