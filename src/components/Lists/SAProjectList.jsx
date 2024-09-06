import React, { useState } from 'react';
import {
    Box, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Dialog,
    DialogTitle, DialogContent, TablePagination,
    Typography
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import SAProjectForm from '../Forms/SAProjectForm';
import Notification from '../Notification';
import ConfirmAction from '../utils/ConfirmAction';

const statusColors = {
    not_started: '#FFCCBC',
    in_progress: '#FFE082',
    completed: '#C8E6C9',
};

const initialProjects = [
    { id: 1, title: 'Project A', description: 'Description A', status: 'not_started', activated: true, owner: { username: 'User1' } },
    { id: 2, title: 'Project B', description: 'Description B', status: 'in_progress', activated: false, owner: { username: 'User2' } },
    // Add more mock projects as needed
];

const SAProjectList = () => {
    const [projects, setProjects] = useState(initialProjects);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [notification, setNotification] = useState({ open: false, message: '' });
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deleteProjectId, setDeleteProjectId] = useState(null);

    const handleEditClick = (project) => {
        setEditingProject(project);
        setIsFormVisible(true);
    };

    const handleDeleteClick = (projectId) => {
        setDeleteProjectId(projectId);
        setIsConfirmOpen(true);
    };

    const confirmDeleteProject = (projectId) => {
        setProjects(projects.filter(project => project.id !== projectId));
        setIsConfirmOpen(false);
        setNotification({ open: true, message: 'Project deleted successfully.' });
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
        setEditingProject(null);
    };

    const handleAddOrEditProject = (project) => {
        if (editingProject) {
            setProjects(projects.map(p => p.id === project.id ? project : p));
            setNotification({ open: true, message: 'Project updated successfully.' });
        } else {
            setProjects([...projects, { ...project, id: projects.length + 1 }]);
            setNotification({ open: true, message: 'Project added successfully.' });
        }
        setIsFormVisible(false);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={toggleFormVisibility}
                >
                    Add New Project
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ boxShadow: 4, borderRadius: 3 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#B2DFDB' }}>
                        <TableRow>
                            <TableCell><Typography>Title</Typography></TableCell>
                            <TableCell><Typography>Description</Typography></TableCell>
                            <TableCell><Typography>Status</Typography></TableCell>
                            <TableCell><Typography>Activated</Typography></TableCell>
                            <TableCell><Typography>Owner</Typography></TableCell>
                            <TableCell><Typography>Actions</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((project) => (
                            <TableRow key={project.id}>
                                <TableCell>{project.title}</TableCell>
                                <TableCell>{project.description}</TableCell>
                                <TableCell>
                                    <Box
                                        component="span"
                                        sx={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            backgroundColor: statusColors[project.status] || '#FFFFFF',
                                            color: 'black',
                                        }}
                                    >
                                        {project.status.replace('_', ' ').charAt(0).toUpperCase() + project.status.replace('_', ' ').slice(1)}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    {project.activated ? 'Yes' : 'No'}
                                </TableCell>
                                <TableCell>
                                    {project.owner ? project.owner.username : 'No Owner'}
                                </TableCell>
                                <TableCell>
                                    <IconButton aria-label='edit project' color="primary" onClick={() => handleEditClick(project)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton aria-label='delete project' color="secondary" onClick={() => handleDeleteClick(project.id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={projects.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <Dialog open={isFormVisible} onClose={toggleFormVisibility}
                fullWidth maxWidth='sm'>
                <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
                <DialogContent>
                    <SAProjectForm
                        onSubmit={handleAddOrEditProject}
                        project={editingProject}
                        isEditing={!!editingProject}
                        onCancel={toggleFormVisibility}
                    />
                </DialogContent>
            </Dialog>

            <Notification
                open={notification.open}
                onClose={() => setNotification({ open: false, message: '' })}
                message={notification.message}
            />

            <ConfirmAction
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={() => confirmDeleteProject(deleteProjectId)}
                title="Delete Project"
                content="Are you sure you want to delete this project? This action cannot be undone."
            />
        </Box>
    );
};

export default SAProjectList;
