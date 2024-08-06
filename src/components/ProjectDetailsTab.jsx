import React, { useState, useEffect } from 'react';
import { Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import ProjectForm from './ProjectForm';
import baseURL from '../apiConfig';
import axios from 'axios';
import { useProject } from './OwnerContainer';
import Notification from './Notification';

const ProjectDetailsTab = () => {
    const [isEditing, setIsEditing] = useState(false);
    const { selectedProject, setSelectedProject } = useProject();
    const [notification, setNotification] = useState({ open: false, message: '' });

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleEditClose = () => {
        setIsEditing(false);
    };

    const handleDeleteClick = () => {
        axios.delete(`${baseURL}/api/projects/${selectedProject.id}`)
            .then((response) => {
                setNotification({ open: true, message: 'Project deleted successfully' });
                setSelectedProject(null);
            })
            .catch((error) => {
                console.error(error);
                setNotification({ open: true, message: 'Failed to delete project' });
            });
    };

    useEffect(() => {
        // in case of editing, update the selected project
        // fetch the project details from the server again
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
        <div>
            {selectedProject ? (
                <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        Title: {selectedProject.title}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Description: {selectedProject.description}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Status: {selectedProject.status}
                    </Typography>
                    <Button variant="contained" color="primary" onClick={handleEditClick}>
                        Edit
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleDeleteClick} sx={{ ml: 2 }}>
                        Delete
                    </Button>
                </>
            ) : (
                <Typography variant="body1" gutterBottom>
                    No project selected.
                </Typography>
            )}

            <Dialog open={isEditing} onClose={handleEditClose}>
                <DialogTitle>Edit Project</DialogTitle>
                <DialogContent>
                    <ProjectForm owner_id={selectedProject?.owner_id} project={selectedProject} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <Notification
                open={notification.open}
                message={notification.message}
                onClose={() => setNotification({ open: false, message: '' })}
            />
        </div>
    );
};

export default ProjectDetailsTab;
