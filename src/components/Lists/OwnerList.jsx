import React, { useState } from 'react';
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
    Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import OwnerForm from '../Forms/OwnerForm'; // Create this form similar to GuestForm
import Notification from '../Notification';

const OwnerList = ({ owners, onAddOrEdit, onDelete, onViewProjects }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [editingOwner, setEditingOwner] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '' });

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleAddOrEditOwner = (owner) => {
        try {
            onAddOrEdit(owner);
            setNotification({ open: true, message: 'Owner saved successfully' });
        } catch (error) {
            setNotification({ open: true, message: 'Failed to save owner' });
        } finally {
            setIsFormVisible(false);
            setEditingOwner(null);
        }
    };

    const handleEditClick = (owner) => {
        setEditingOwner(owner);
        setIsFormVisible(true);
    };

    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
        setEditingOwner(null);
    };

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
                    <OwnerForm onSubmit={handleAddOrEditOwner} owner={editingOwner} isEditing={Boolean(editingOwner)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleFormVisibility} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
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
                                            <IconButton onClick={() => handleEditClick(owner)} sx={{ '&:hover': { color: 'blue' } }}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton color='warning' onClick={() => onDelete(owner.id)} sx={{ '&:hover': { color: 'red' } }}>
                                                <Delete />
                                            </IconButton>
                                            <Button color='secondary' onClick={() => onViewProjects(owner)}
                                                sx={{ borderRadius: 4 }}>
                                                View Projects
                                            </Button>
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
            <Notification
                open={notification.open}
                message={notification.message}
                onClose={() => setNotification({ open: false, message: '' })}
            />
        </Box>
    );
};

export default OwnerList;
