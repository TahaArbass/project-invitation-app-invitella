// CommonAppBar.js
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Drawer, Button, Box } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBack from '@mui/icons-material/ArrowBack';

const CommonAppBar = ({ userRole, onProfileClick, onLogoutClick, onContactUsClick, onBackToOwnersClick }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleMenu = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    {userRole === 'admin' && (
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerToggle}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Project Management System
                    </Typography>
                    <div>
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            keepMounted
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={onProfileClick}>My Profile</MenuItem>
                            <MenuItem onClick={onContactUsClick}>Contact Us</MenuItem>
                            <MenuItem onClick={onLogoutClick}>
                                <Typography color={'error'}>
                                    Log Out
                                </Typography>
                            </MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
            {userRole === 'admin' && (
                <Drawer open={drawerOpen} onClose={handleDrawerToggle}>
                    <Box sx={{ p: 2 }}>
                        <Button color='secondary' sx={{ '.&:hover': { backgroundColor: 'grey' }, borderRadius: 4 }}
                            startIcon={<ArrowBack />}
                            onClick={() => {
                                onBackToOwnersClick();
                                handleDrawerToggle();
                            }}
                        >
                            Back to Owners
                        </Button>
                    </Box>
                </Drawer>
            )}
        </div>
    );
};

export default CommonAppBar;
