import React, { useEffect, useState } from 'react';
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
    Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, CircularProgress
} from '@mui/material';
import axios from 'axios';
import baseURL from '../../apiConfig';
import GuestForm from '../Forms/GuestForm';
import { useProject } from '../OwnerContainer';
import { Delete, Edit, Add, ChairAlt } from '@mui/icons-material';
import Notification from '../Notification';
import ConfirmAction from '../utils/ConfirmAction';
import TableSelector from '../../pages/DemoPage';
const GuestList = () => {
    const [guests, setGuests] = useState([]);
    const [tables, setTables] = useState([]);
    const [guestTables, setGuestTables] = useState([]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [editingGuest, setEditingGuest] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ open: false, message: '' });
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deleteGuestId, setDeleteGuestId] = useState(null);

    const [selectedGuest, setSelectedGuest] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);

    const { selectedProject } = useProject();
    useEffect(() => {
        const fetchGuests = async () => {
            if (!selectedProject?.id) return;
            setLoading(true);
            try {
                // Fetch all guests for the selected project
                const response = await axios.get(`${baseURL}/api/guests/project/${selectedProject.id}`);
                setGuests(response.data);
                // Fetch all tables owned by the current user
                const tablesResponse = await axios.get(`${baseURL}/api/tables/project/${selectedProject.id}`);
                setTables(tablesResponse.data);

                // fetch tableGuests
                const guestTablesResponse = await axios.get(`${baseURL}/api/guestTables/project/${selectedProject.id}`);
                setGuestTables(guestTablesResponse.data);
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
            setNotification({ open: true, message: 'Guest saved successfully' });
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

    const handleTableAssignClick = (guest) => {
        setSelectedGuest(guest);
        setIsTableDialogOpen(true);
    };

    const handleTableAssign = async () => {
        if (selectedGuest && selectedTable) {
            try {
                // Check if the guest already has a table assignment
                const existingAssignment = await axios.get(`${baseURL}/api/guestTables/${selectedProject.id}/${selectedGuest.id}`);
                if (existingAssignment.data) {
                    // Update existing assignment
                    await axios.put(`${baseURL}/api/guestTables/${existingAssignment.data.id}`, {
                        table_id: selectedTable.id,
                        guest_id: selectedGuest.id,
                        project_id: selectedProject.id
                    });

                    // update the guestTables state
                    setGuestTables(guestTables.map(gt => (gt.id === existingAssignment.data.id ? { ...gt, table_id: selectedTable.id } : gt)));
                } else {
                    // Create new assignment
                    let response = await axios.post(`${baseURL}/api/guestTables`, {
                        project_id: selectedProject.id,
                        guest_id: selectedGuest.id,
                        table_id: selectedTable.id
                    });

                    // update the guestTables state
                    setGuestTables([...guestTables, response.data]);
                }

                setNotification({ open: true, message: 'Table assigned successfully' });
                setIsTableDialogOpen(false);
                setSelectedGuest(null);
                setSelectedTable(null);
            } catch (error) {
                console.error('Error assigning table:', error);
                setNotification({ open: true, message: 'Failed to assign table' });
            }
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
                    <GuestForm onSubmit={handleAddOrEditGuest} guest={editingGuest} isEditing={Boolean(editingGuest)} onCancel={toggleFormVisibility} />
                </DialogContent>
            </Dialog>
            <TableContainer component={Paper} sx={{ boxShadow: 4, borderRadius: 3 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: 'bisque' }}>
                        <TableRow>
                            <TableCell sx={{ width: '18%' }}><Typography noWrap>First Name</Typography></TableCell>
                            <TableCell sx={{ width: '18%' }}><Typography noWrap>Last Name</Typography></TableCell>
                            <TableCell sx={{ width: '12%' }}><Typography noWrap>Telephone</Typography></TableCell>
                            <TableCell sx={{ width: '12%' }}><Typography noWrap>RSVP Status</Typography></TableCell>
                            <TableCell sx={{ width: '12%' }}><Typography noWrap> Table</Typography></TableCell>
                            <TableCell sx={{ width: '10%' }}><Typography noWrap>Actions</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {guests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6}>
                                    <Typography variant="body2" color="textSecondary" align="center">
                                        No guests found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            guests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((guest, index) => {
                                // Find the table for the current guest
                                const matchedTable = guestTables.find(gt => gt.guest_id === guest.id);
                                let assignedTable = null;
                                if (matchedTable) {
                                    assignedTable = tables.find(t => t.id === matchedTable.table_id);
                                }

                                // Render the guest row
                                return (
                                    <TableRow key={index} sx={{ '&:hover': { backgroundColor: 'beige' } }}>
                                        <TableCell>{guest.first_name}</TableCell>
                                        <TableCell>{guest.last_name}</TableCell>
                                        <TableCell>{guest.telephone}</TableCell>
                                        <TableCell>
                                            <Box
                                                sx={{
                                                    textAlign: 'center',
                                                    ...getRSVPStatusStyles(guest.rsvp_status),
                                                    borderRadius: 1,
                                                    padding: '4px',
                                                }}
                                            >
                                                {guest.rsvp_status}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            {assignedTable ? assignedTable.label : 'Not Assigned'}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleEditClick(guest)} sx={{ '&:hover': { color: 'blue' }, mr: 1 }}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteClick(guest.id)} sx={{ '&:hover': { color: 'red' }, mr: 1 }}>
                                                <Delete />
                                            </IconButton>
                                            <IconButton onClick={() => handleTableAssignClick(guest)} sx={{ '&:hover': { color: 'green' } }}>
                                                <ChairAlt />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={guests.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </TableContainer>
            <Notification
                open={notification.open}
                message={notification.message}
                onClose={() => setNotification({ open: false, message: '' })}
            />
            <ConfirmAction
                open={isConfirmOpen}
                title="Confirm Delete"
                content="Are you sure you want to delete this guest?"
                onConfirm={() => confirmDeleteGuest(deleteGuestId)}
                onClose={() => setIsConfirmOpen(false)}
            />
            <Dialog open={isTableDialogOpen} onClose={() => setIsTableDialogOpen(false)}>
                <DialogTitle>Select Table for {selectedGuest?.first_name}</DialogTitle>
                <DialogContent>
                    <TableSelector onSelectTable={(table) => setSelectedTable(table)} />
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' onClick={handleTableAssign} color="primary">
                        Assign
                    </Button>
                    <Button variant='contained' onClick={() => setIsTableDialogOpen(false)} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default GuestList;
