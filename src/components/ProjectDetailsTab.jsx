import React, { useState, useEffect } from 'react';
import { Typography, Button, Dialog, DialogContent, TextField, Box, Card, CardContent, CardActions } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ProjectForm from './ProjectForm';
import baseURL from '../apiConfig';
import axios from 'axios';
import { useProject } from './OwnerContainer';
import Notification from './Notification';
import ConfirmAction from './utils/ConfirmAction';

const ProjectDetailsTab = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const { selectedProject, setSelectedProject } = useProject();
    const [notification, setNotification] = useState({ open: false, message: '' });

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleEditClose = () => {
        setIsEditing(false);
    };

    const handleDeleteClick = () => {
        setIsConfirmOpen(true);
    };

    const confirmDeleteProject = () => {
        axios.put(`${baseURL}/api/projects/deactivate/${selectedProject.id}`)
            .then((response) => {
                setNotification({ open: true, message: 'Project deleted successfully' });
                setSelectedProject(null);
            })
            .catch((error) => {
                console.error(error);
                setNotification({ open: true, message: 'Failed to delete project' });
            })
            .finally(() => {
                setIsConfirmOpen(false);
            });
    };

    useEffect(() => {

        if (!selectedProject?.id) return;

        axios.get(`${baseURL}/api/projects/${selectedProject.id}`)
            .then((response) => {
                setSelectedProject(response.data);
            })
            .catch((error) => {
                setNotification({ open: true, message: 'Failed to load project details' });
            });
    }, [isEditing]);

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, px: 2 }}>
            {selectedProject ? (
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h5" component="div" gutterBottom>
                            Project Details
                        </Typography>
                        <TextField
                            label="Title"
                            value={selectedProject.title}
                            fullWidth
                            margin="normal"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                        <TextField
                            label="Description"
                            value={selectedProject.description}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                        <TextField
                            label="Status"
                            value={selectedProject.status}
                            fullWidth
                            margin="normal"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <Button variant="contained" color="primary" onClick={handleEditClick} startIcon={<EditIcon />}>
                            Edit
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleDeleteClick} startIcon={<DeleteIcon />} sx={{ ml: 2 }}>
                            Delete
                        </Button>
                    </CardActions>
                </Card>
            ) : (
                <Typography variant="body1" gutterBottom>
                    No project selected.
                </Typography>
            )}

            <Dialog open={isEditing} onClose={handleEditClose}>
                <DialogContent>
                    <ProjectForm owner_id={selectedProject?.owner_id} project={selectedProject} onCancel={handleEditClose} />
                </DialogContent>
            </Dialog>

            <ConfirmAction
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDeleteProject}
                title="Confirm Deletion"
                content="Are you sure you want to delete this project? You won't be able to access data related to it anymore."
            />

            <Notification
                open={notification.open}
                message={notification.message}
                onClose={() => setNotification({ open: false, message: '' })}
            />
        </Box>
    );
};

export default ProjectDetailsTab;
