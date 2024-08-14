import React, { useState, useEffect, createContext, useContext } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CircularProgress, Dialog, DialogContent } from '@mui/material';
import OwnerProjects from '../components/OwnerProjects';
import Notification from '../components/Notification';
import ProjectForm from '../components/ProjectForm';
import baseURL from '../apiConfig';
import { Add, ArrowBack } from '@mui/icons-material';
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
        // Fetch activated projects here
        setLoading(true);
        fetch(`${baseURL}/api/projects/activated/owner/${owner.id}`)
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
                            <Typography variant="h4" align="center" fontWeight={'bold'} gutterBottom sx={{ mt: 2 }}>
                                Projects
                            </Typography>
                            <Button variant="contained" color="primary" onClick={handleAddProject}>
                                <Add />
                                Add Project
                            </Button>
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                                    <CircularProgress />
                                </Box>
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
                <Dialog open={showForm} onClose={handleFormClose} fullWidth>
                    <DialogContent>
                        <ProjectForm owner_id={owner.id} onSave={handleSaveProject} onCancel={handleFormClose} />
                    </DialogContent>
                </Dialog>
                <Notification open={notification.open} message={notification.message} onClose={handleNotificationClose} />
            </ProjectContext.Provider>
        </>
    );
};

export default OwnerContainer;
