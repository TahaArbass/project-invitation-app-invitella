// OwnerContainer.jsx
import React, { useState, useEffect } from 'react';
import CommonAppBar from '../components/CommonAppBar';
import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import OwnerProjects from '../components/OwnerProjects';
import Notification from '../components/Notification';
import baseURL from '../apiConfig';
import { ArrowBack } from '@mui/icons-material';
import { BackButton } from '../styles';

const OwnerContainer = ({ owner }) => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [notification, setNotification] = useState({ open: false, message: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch projects here
        setLoading(true);
        fetch(`${baseURL}/api/projects/owner/${owner.dbUser.id}`)
            .then((response) => response.json())
            .then((data) => {
                setProjects(data);
                setLoading(false);
            })
            .catch((error) => {
                setNotification({ open: true, message: "yo" });
                setLoading(false);
            });
    }, [owner.dbUser.id]);


    const handleProjectClick = (project) => {
        setSelectedProject(project);
    };

    const handleAddProject = () => {
        // Handle add project logic
        setNotification({ open: true, message: 'Add Project clicked' });
    };

    const handleProfileClick = () => {
        // Handle profile click
        setNotification({ open: true, message: 'Profile clicked' });
    };

    const handleLogoutClick = () => {
        // Handle logout
        setNotification({ open: true, message: 'Logged out' });
    };

    const handleNotificationClose = () => {
        setNotification({ open: false, message: '' });
    };

    return (
        <>
            <CommonAppBar
                userRole="Owner"
                onProfileClick={handleProfileClick}
                onLogoutClick={handleLogoutClick}
            />
            <Box sx={{ p: 1 }}>
                {selectedProject ? (
                    <>
                        <BackButton
                            onClick={() => setSelectedProject(null)}>
                            <ArrowBack />
                            <Typography variant='body1'>Back</Typography>
                        </BackButton>
                        <OwnerProjects project={selectedProject} />
                    </>

                ) : (
                    <>
                        <Typography variant="h4" align="center" gutterBottom sx={{ mt: 2 }}>
                            Projects
                        </Typography>
                        <Button variant="contained" color="primary" onClick={handleAddProject}>
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
            <Notification
                open={notification.open}
                message={notification.message}
                onClose={handleNotificationClose}
            />
        </>
    );
};

export default OwnerContainer;
