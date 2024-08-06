import React, { useState, useEffect, createContext, useContext } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, IconButton } from '@mui/material';
import OwnerProjects from '../components/OwnerProjects';
import Notification from '../components/Notification';
import ProjectForm from '../components/ProjectForm';
import baseURL from '../apiConfig';
import { Add, ArrowBack, Close } from '@mui/icons-material';
import { BackButton } from '../styles';

const ProjectContext = createContext();

export const useProject = () => {
    return useContext(ProjectContext);
};

const OwnerContainer = ({ owner }) => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch projects here
        setLoading(true);
        fetch(`${baseURL}/api/projects/owner/${owner.id}`)
            .then((response) => response.json())
            .then((data) => {
                setProjects(data);
                setLoading(false);
            })
            .catch((error) => {
                setNotification({ open: true, message: "Failed to load projects." });
                setLoading(false);
            });
    }, [owner.id, selectedProject, showForm]);

    const handleProjectClick = (project) => {
        setSelectedProject(project);
    };

    const handleAddProject = () => {
        setSelectedProject(null);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
    };

    const handleSaveProject = (project) => {
        if (selectedProject) {
            // Update existing project
            setProjects(projects.map((p) => (p.id === project.id ? project : p)));
        } else {
            // Add new project
            setProjects([...projects, project]);
        }
        handleFormClose();
    };

    const handleNotificationClose = () => {
        setNotification({ open: false, message: '' });
    };

    return (
        <>
            <ProjectContext.Provider value={{ selectedProject, setSelectedProject }}>
                <Box sx={{
                    p: 1,
                    width: '100%',
                    height: '100%',
                    overflowY: 'auto',
                }}>
                    {selectedProject ? (
                        <>
                            <BackButton onClick={() => setSelectedProject(null)}>
                                <ArrowBack />
                                <Typography variant='body1'>Back</Typography>
                            </BackButton>
                            <OwnerProjects />
                        </>
                    ) : (
                        <>
                            <Typography variant="h3" align="center" fontWeight={'bold'} gutterBottom sx={{ mt: 2 }}>
                                Projects
                            </Typography>
                            <Button variant="contained" color="primary" onClick={handleAddProject}>
                                <Add />
                                Add Project
                            </Button>
                            {loading ? (
                                <Typography>Loading...</Typography>
                            ) : (
                                <Grid container spacing={2} marginTop={2}>
                                    {projects.length > 0 && (
                                        projects.map((project) => (
                                            <Grid item xs={12} sm={6} md={3} key={project.id}>
                                                <Card onClick={() => handleProjectClick(project)} style={{ cursor: 'pointer' }}>
                                                    <CardContent>
                                                        <Typography variant="h6">{project.title}</Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))
                                    )}
                                </Grid>
                            )}
                        </>
                    )}
                </Box>
                {showForm && (
                    <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', bgcolor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Box sx={{ position: 'relative', width: '80%', maxWidth: '500px', bgcolor: 'background.paper', p: 2, borderRadius: 1, boxShadow: 3 }}>
                            <IconButton onClick={handleFormClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
                                <Close />
                            </IconButton>
                            <ProjectForm owner_id={owner.id} project={selectedProject} onSave={handleSaveProject} />
                        </Box>
                    </Box>
                )}
                <Notification open={notification.open} message={notification.message} onClose={handleNotificationClose} />
            </ProjectContext.Provider>
        </>
    );
};

export default OwnerContainer;
