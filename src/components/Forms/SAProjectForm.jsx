import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, MenuItem, CircularProgress } from '@mui/material';
import api from '../../utils/api';

const statusOptions = [
    { value: 'not_started', label: 'Not Started' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
];

const SAProjectForm = ({ onSubmit, project, isEditing, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'not_started',
        owner_id: '',
        activated: true,
    });

    const [ownerSearch, setOwnerSearch] = useState('');
    const [owners, setOwners] = useState([]);
    const [loadingOwners, setLoadingOwners] = useState(false);

    useEffect(() => {
        if (isEditing && project) {
            setFormData({
                title: project.title,
                description: project.description,
                status: project.status,
                owner_id: project.owner_id,
                activated: project.activated,
            });
        }
    }, [isEditing, project]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleOwnerSearch = async (event) => {
        const searchValue = event.target.value;
        setOwnerSearch(searchValue);

        if (searchValue.length >= 2) {
            setLoadingOwners(true);
            try {
                const response = await api.get(`/api/owners/search`, { params: { q: searchValue } });
                setOwners(response.data);
            } catch (error) {
                console.error('Error fetching owners:', error);
            } finally {
                setLoadingOwners(false);
            }
        } else {
            setOwners([]);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(formData);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                fullWidth
            />
            <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                multiline
                fullWidth
                rows={4}
            />
            <TextField
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                fullWidth
            >
                {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                label="Search Owner"
                value={ownerSearch}
                onChange={handleOwnerSearch}
                placeholder="Type at least 2 characters"
            />
            {loadingOwners ? (
                <CircularProgress size={24} sx={{ alignSelf: 'center' }} />
            ) : (
                <TextField
                    select
                    label="Owner"
                    name="owner_id"
                    value={formData.owner_id}
                    onChange={handleChange}
                    required
                    fullWidth
                    disabled={owners.length === 0}
                >
                    {owners.map((owner) => (
                        <MenuItem key={owner.id} value={owner.id}>
                            {owner.username}
                        </MenuItem>
                    ))}
                </TextField>
            )}
            <TextField
                select
                label="Activated"
                name="activated"
                value={formData.activated}
                onChange={handleChange}
                required
                fullWidth
            >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Inactive</MenuItem>
            </TextField>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button type="submit" variant="contained" color="primary">
                    {isEditing ? 'Save Changes' : 'Add Project'}
                </Button>
                <Button variant="contained" color="secondary" onClick={onCancel}>
                    Cancel
                </Button>
            </Box>
        </Box>
    );
};

export default SAProjectForm;
