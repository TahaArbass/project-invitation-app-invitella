import React, { useEffect, useState } from 'react';
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
    Paper, Button, Dialog, DialogContent, DialogTitle, IconButton, Typography, CircularProgress
} from '@mui/material';
import TableForm from '../Forms/TableForm';
import { useProject } from '../OwnerContainer';
import { Delete, Edit, Add } from '@mui/icons-material';
import Notification from '../Notification';
import ConfirmAction from '../utils/ConfirmAction';
import api from '../../utils/api';

const TableList = () => {
    const [tables, setTables] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [editingTable, setEditingTable] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ open: false, message: '' });
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deleteTableId, setDeleteTableId] = useState(null);

    const { selectedProject } = useProject();

    useEffect(() => {
        const fetchTables = async () => {
            if (!selectedProject?.id) return;
            setLoading(true);
            try {
                // Fetch all tables for the selected project
                const response = await api.get(`/api/tables/project/${selectedProject.id}`);
                setTables(response.data);
            } catch (error) {
                console.error('Error fetching table list:', error);
                setNotification({ open: true, message: 'Failed to fetch tables' });
            } finally {
                setLoading(false);
            }
        };
        fetchTables();
    }, [selectedProject?.id]);

    const handleAddOrEditTable = async (table) => {
        let response;
        // add project_id to the table object
        table.project_id = selectedProject.id;
        try {
            if (editingTable) {
                response = await api.put(`/api/tables/${editingTable.id}`, table);
                setTables(tables.map(t => (t.id === editingTable.id ? { ...t, ...table } : t)));
            } else {
                table.project_id = selectedProject.id;
                response = await api.post(`/api/tables`, table);
                setTables([...tables, response.data]);
            }
        } catch (error) {
            console.error('Error saving table:', error);
            setNotification({ open: true, message: 'Failed to save table' });
        } finally {
            setNotification({ open: true, message: 'Table saved successfully' });
            setIsFormVisible(false);
            setEditingTable(null);
        }
    };

    const handleEditClick = (table) => {
        setEditingTable(table);
        setIsFormVisible(true);
    };

    const handleDeleteClick = (tableId) => {
        setIsConfirmOpen(true);
        setDeleteTableId(tableId);
    };

    const confirmDeleteTable = async (tableId) => {
        try {
            await api.delete(`/api/tables/${tableId}`);
            setTables(tables.filter(table => table.id !== tableId));
            setNotification({ open: true, message: 'Table deleted successfully' });
            setIsConfirmOpen(false);
            setDeleteTableId(null);
        } catch (error) {
            console.error('Error deleting table:', error);
            setNotification({ open: true, message: 'Failed to delete table' });
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
        setEditingTable(null);
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
                Tables
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Button onClick={toggleFormVisibility} variant="contained" color="primary">
                    <Add />
                    {isFormVisible ? 'Close Form' : 'Add Table'}
                </Button>
            </Box>
            <Dialog open={isFormVisible} onClose={toggleFormVisibility}>
                <DialogTitle>{editingTable ? 'Edit Table' : 'Add Table'}</DialogTitle>
                <DialogContent>
                    <TableForm onSubmit={handleAddOrEditTable} table={editingTable} isEditing={Boolean(editingTable)} onCancel={toggleFormVisibility} />
                </DialogContent>
            </Dialog>
            <TableContainer component={Paper} sx={{ boxShadow: 4, borderRadius: 3 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#B2DFDB' }}>
                        <TableRow>
                            <TableCell sx={{ width: '30%' }}>
                                <Typography noWrap>Table Label</Typography>
                            </TableCell>
                            <TableCell sx={{ width: '50%' }}>
                                <Typography noWrap>Table Description</Typography>
                            </TableCell>
                            <TableCell sx={{ width: '20%' }}>
                                <Typography>Actions</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tables.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3}>
                                    <Typography variant="body2" color="textSecondary" align="center">
                                        No tables found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            tables.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((table, index) => (
                                <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#E6F7F7' } }}>
                                    <TableCell>{table.label}</TableCell>
                                    <TableCell>{table.description}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEditClick(table)} sx={{ '&:hover': { color: 'blue' }, mr: 1 }}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteClick(table.id)} sx={{ '&:hover': { color: 'red' } }}>
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
                    count={tables.length}
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
                content="Are you sure you want to delete this table?"
                onConfirm={() => confirmDeleteTable(deleteTableId)}
                onClose={() => setIsConfirmOpen(false)}
            />
        </Box>
    );
};

export default TableList;
