import { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, Container, Grid, Card, CardContent, Button, Tabs, Tab, Box, CardMedia, Tooltip, Paper, TextField, Fade, Divider, Menu, MenuItem } from '@mui/material';
import { Menu as MenuIcon, Add as AddIcon, Edit as EditIcon, Search as SearchIcon, Photo as PhotoIcon, Group as GroupIcon, MailOutline as MailOutlineIcon, AccountCircle, Settings as SettingsIcon, Logout as LogoutIcon } from '@mui/icons-material';
import baseURL from '../apiConfig';

const ProjectManager = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [tab, setTab] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [projects, setProjects] = useState([]);

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // fetch projects from API
    useEffect(() => {
        fetch(`${baseURL}/api/projects/`)
            .then(response => response.json())
            .then(data => {
                setProjects(data);
            });
    }, []);

    const handleProjectSelect = (project) => {
        setSelectedProject(project);
        setTab(0);
        setDrawerOpen(false);
    };

    const handleChangeTab = (event, newValue) => {
        setTab(newValue);
    };

    const handleBackToProjects = () => {
        setSelectedProject(null);
        setDrawerOpen(false);
    };

    return (
        <div>
            <AppBar position="fixed" color="primary">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>Project Manager</Typography>
                    <Tooltip title="Create New Project">
                        <IconButton color="inherit">
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                    <IconButton color="inherit" onClick={handleMenu}>
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}><SettingsIcon /> Settings</MenuItem>
                        <MenuItem onClick={handleClose}><LogoutIcon /> Log out</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Drawer open={drawerOpen} onClose={toggleDrawer(false)} transitionDuration={500}>
                <List>
                    <ListItem>
                        <Button sx={{ color: "black" }} onClick={handleBackToProjects}>Back to Projects</Button>
                    </ListItem>
                    <Divider />
                </List>
            </Drawer>
            <Container style={{ marginTop: 80 }}>
                {selectedProject ? (
                    <Fade in={!!selectedProject}>
                        <div>
                            <Typography variant="h4" gutterBottom>{selectedProject.title}</Typography>
                            <Tabs value={tab} onChange={handleChangeTab} aria-label="project tabs">
                                <Tab label="Invitations" icon={<MailOutlineIcon />} />
                                <Tab label="Guests" icon={<GroupIcon />} />
                                <Tab label="Photos" icon={<PhotoIcon />} />
                            </Tabs>
                            <TabPanel value={tab} index={0}>
                                <InvitationTab invitations={selectedProject.invitations} />
                            </TabPanel>
                            <TabPanel value={tab} index={1}>
                                <GuestTab guests={selectedProject.guests} />
                            </TabPanel>
                            <TabPanel value={tab} index={2}>
                                <PhotoTab photos={selectedProject.photos} />
                            </TabPanel>
                        </div>
                    </Fade>
                ) : (
                    <OwnerDashboard projects={projects} handleProjectSelect={handleProjectSelect} />
                )}
            </Container>
        </div>
    );
};

// OwnerDashboard Component
const OwnerDashboard = ({ projects, handleProjectSelect }) => (
    <Container>
        <Typography variant="h4" gutterBottom>My Projects</Typography>
        <Grid container spacing={3}>
            {projects.map(project => (
                <Grid item xs={12} sm={6} md={4} key={project.id}>
                    <ProjectCard project={project} handleProjectSelect={handleProjectSelect} />
                </Grid>
            ))}
            <Grid item xs={12}>
                <Button variant="contained" color="primary" startIcon={<AddIcon />}>Create New Project</Button>
            </Grid>
        </Grid>
    </Container>
);

const ProjectCard = ({ project, handleProjectSelect }) => (
    <Card onClick={() => handleProjectSelect(project)} style={{ cursor: 'pointer', transition: '0.3s', '&:hover': { boxShadow: '0 8px 16px rgba(0,0,0,0.2)' } }}>
        <CardContent>
            <Typography variant="h5">{project.name}</Typography>
        </CardContent>
    </Card>
);

// InvitationTab Component
const InvitationTab = ({ invitations }) => (
    <Grid container spacing={3}>
        {invitations.map(invitation => (
            <Grid item xs={12} sm={6} md={4} key={invitation.id}>
                <InvitationCard invitation={invitation} />
            </Grid>
        ))}
        <Grid item xs={12}>
            <Button variant="contained" color="primary" startIcon={<AddIcon />}>Create New Invitation</Button>
        </Grid>
    </Grid>
);

const InvitationCard = ({ invitation }) => (
    <Card>
        <CardContent>
            <Typography variant="h5">{`Invitation ${invitation.id}`}</Typography>
            <Button variant="outlined" color="primary" startIcon={<EditIcon />}>Edit Invitation</Button>
        </CardContent>
    </Card>
);

// GuestTab Component
const GuestTab = ({ guests }) => (
    <div>
        <TextField label="Search Guests" variant="outlined" fullWidth margin="normal" InputProps={{ startAdornment: <SearchIcon position="start" /> }} />
        <Grid container spacing={3}>
            {guests.map(guest => (
                <Grid item xs={12} sm={6} md={4} key={guest.id}>
                    <GuestCard guest={guest} />
                </Grid>
            ))}
            <Grid item xs={12}>
                <Button variant="contained" color="primary" startIcon={<AddIcon />}>Add New Guest</Button>
            </Grid>
        </Grid>
    </div>
);

const GuestCard = ({ guest }) => (
    <Card>
        <CardContent>
            <Typography variant="h5">{guest.name}</Typography>
            <Typography variant="body2">{guest.email}</Typography>
            <Button variant="outlined" color="primary" startIcon={<EditIcon />}>Edit Guest</Button>
        </CardContent>
    </Card>
);

// PhotoTab Component
const PhotoTab = ({ photos }) => (
    <div>
        <Grid container spacing={3}>
            {photos.map(photo => (
                <Grid item xs={12} sm={6} md={4} key={photo.id}>
                    <Card>
                        <CardMedia component="img" alt="Guest photo" image={photo.url} title="Guest photo" />
                    </Card>
                </Grid>
            ))}
        </Grid>
        <Button variant="contained" color="primary" startIcon={<AddIcon />}>Upload Photos</Button>
    </div>
);

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && (
                <Box p={3}>
                    <Paper elevation={3} style={{ padding: '16px' }}>
                        {children}
                    </Paper>
                </Box>
            )}
        </div>
    );
};

export default ProjectManager;
