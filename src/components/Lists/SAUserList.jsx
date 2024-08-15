import React, { useEffect, useState } from 'react';
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
    Paper, Button, Dialog, DialogContent, DialogTitle, IconButton, Typography, CircularProgress
} from '@mui/material';
import axios from 'axios';
import { Delete, Edit, Add } from '@mui/icons-material';
import SAUserForm from '../Forms/SAUserForm';
import Notification from '../Notification';
import ConfirmAction from '../utils/ConfirmAction';

const roleColors = {
    admin: 'lightblue',
    owner: 'lightgreen',
    superadmin: 'lightcoral',
};

const statusColors = {
    true: 'lightgreen',
    false: 'lightcoral',
};

const SAUserList = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [editingUser, setEditingUser] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ open: false, message: '' });
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
                setNotification({ open: true, message: 'Failed to fetch users' });
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleAddOrEditUser = async (user) => {
        let response;
        try {
            if (editingUser) {
                response = await axios.put(`/api/users/${editingUser.id}`, user);
                setUsers(users.map(u => (u.id === editingUser.id ? { ...u, ...user } : u)));
            } else {
                response = await axios.post('/api/users', user);
                setUsers([...users, response.data]);
            }
        } catch (error) {
            console.error('Error saving user:', error);
            setNotification({ open: true, message: 'Failed to save user' });
        } finally {
            setNotification({ open: true, message: 'User saved successfully' });
            setIsFormVisible(false);
            setEditingUser(null);
        }
    };

    const handleEditClick = (user) => {
        setEditingUser(user);
        setIsFormVisible(true);
    };

    const handleDeleteClick = (userId) => {
        setIsConfirmOpen(true);
        setDeleteUserId(userId);
    };

    const confirmDeleteUser = async (userId) => {
        try {
            await axios.delete(`/api/users/${userId}`);
            setUsers(users.filter(user => user.id !== userId));
            setNotification({ open: true, message: 'User deleted successfully' });
            setIsConfirmOpen(false);
            setDeleteUserId(null);
        } catch (error) {
            console.error('Error deleting user:', error);
            setNotification({ open: true, message: 'Failed to delete user' });
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
        setEditingUser(null);
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
                User Management
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Button onClick={toggleFormVisibility} variant="contained" color="primary">
                    <Add />
                    {isFormVisible ? 'Close Form' : 'Add User'}
                </Button>
            </Box>
            <Dialog open={isFormVisible} onClose={toggleFormVisibility}>
                <DialogTitle>{editingUser ? 'Edit User' : 'Add User'}</DialogTitle>
                <DialogContent>
                    <SAUserForm onSubmit={handleAddOrEditUser} user={editingUser} isEditing={Boolean(editingUser)} onCancel={toggleFormVisibility} />
                </DialogContent>
            </Dialog>
            <TableContainer component={Paper} sx={{ boxShadow: 4, borderRadius: 3 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: 'bisque' }}>
                        <TableRow>
                            <TableCell><Typography>ID</Typography></TableCell>
                            <TableCell><Typography>Username</Typography></TableCell>
                            <TableCell><Typography>First Name</Typography></TableCell>
                            <TableCell><Typography>Last Name</Typography></TableCell>
                            <TableCell><Typography>Role</Typography></TableCell>
                            <TableCell><Typography>Status</Typography></TableCell>
                            <TableCell><Typography>Actions</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7}>
                                    <Typography variant="body2" color="textSecondary" align="center">
                                        No users found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                                <TableRow key={index} sx={{ '&:hover': { backgroundColor: 'beige' } }}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.first_name}</TableCell>
                                    <TableCell>{user.last_name}</TableCell>
                                    <TableCell sx={{ backgroundColor: roleColors[user.role] }}>{user.role}</TableCell>
                                    <TableCell sx={{ backgroundColor: statusColors[user.isActivated.toString()] }}>
                                        {user.isActivated ? 'Active' : 'Inactive'}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEditClick(user)} sx={{ '&:hover': { color: 'blue' }, mr: 1 }}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteClick(user.id)} sx={{ '&:hover': { color: 'red' } }}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={users.length}
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
                content="Are you sure you want to delete this user?"
                onConfirm={() => confirmDeleteUser(deleteUserId)}
                onClose={() => setIsConfirmOpen(false)}
            />
        </Box>
    );
};

export default SAUserList;
