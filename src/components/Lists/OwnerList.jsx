import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button, Box, TablePagination, Paper } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const OwnerList = ({ owners, onEdit, onDelete, onViewProjects }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Paper>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Telephone</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {owners.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((owner) => (
                            <TableRow key={owner.id}>
                                <TableCell>{owner.username}</TableCell>
                                <TableCell>{owner.first_name}</TableCell>
                                <TableCell>{owner.last_name}</TableCell>
                                <TableCell>{owner.email}</TableCell>
                                <TableCell>{owner.telephone}</TableCell>
                                <TableCell>
                                    <Box display="flex" gap={2}>
                                        <IconButton onClick={() => onEdit(owner)}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton color='warning' onClick={() => onDelete(owner.id)}>
                                            <Delete />
                                        </IconButton>
                                        <Button onClick={() => onViewProjects(owner)}>View Projects</Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
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
        </Paper>
    );
};

export default OwnerList;
