import React, { useState, useEffect } from 'react';
import { Button, TextField, MenuItem, Select, InputLabel, FormControl, Box, Typography } from '@mui/material';
import baseURL from '../apiConfig';
import Notification from './Notification';

const ProjectForm = ({ owner_id, project = null, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [notification, setNotification] = useState({ open: false, message: '' });

    useEffect(() => {
        if (project) {
            setTitle(project.title);
            setDescription(project.description);
            setStatus(project.status);
        }
    }, [project]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const projectData = {
            title,
            description,
            status,
            owner_id,
        };

        try {
            let response;
            if (project) {
                response = await fetch(`${baseURL}/api/projects/${project.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(projectData),
                });
            } else {
                response = await fetch(`${baseURL}/api/projects`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(projectData),
                });
            }

            if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                setNotification({ open: true, message: 'Project saved successfully.' });
            }

        } catch (error) {
            setNotification({ open: true, message: 'Failed to save project.' });
        } finally {
            // wait for 2 seconds before closing the form
            setTimeout(() => {
                onCancel();
            }, 1200);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
                {project ? 'Edit Project' : 'Create Project'}
            </Typography>
            <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                margin="normal"
                required
                multiline
                rows={4}
            />
            <FormControl required sx={{ width: '40%' }}>
                <InputLabel>Status</InputLabel>
                <Select value={status || ''} label="Status" onChange={(e) => setStatus(e.target.value)}>
                    <MenuItem value="not_started">Not Started</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                </Select>
            </FormControl>
            <Box sx={{ mt: 2 }} >
                <Button type="submit" variant="contained" color="primary">
                    {project ? 'Update Project' : 'Create Project'}
                </Button>
                <Button variant="contained" color="secondary" sx={{ ml: 2 }} onClick={onCancel}>
                    Cancel
                </Button>
            </Box>
            <Notification
                open={notification.open}
                message={notification.message}
                onClose={() => setNotification({ open: false, message: '' })}
            />
        </Box>
    );
};

export default ProjectForm;
