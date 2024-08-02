import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const AppBarComponent = ({ title, buttons }) => {
    const [open, setOpen] = useState(false);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleDrawerToggle}
                        sx={{ marginRight: 'auto' }}
                    >
                        <MenuIcon htmlColor="#000000" fontSize="large" />
                    </IconButton>
                    <Typography variant="h6" sx={{ marginLeft: 2, flexGrow: 1 }}>
                        {title}
                    </Typography>
                </Toolbar>
            </AppBar>
        </>
    );
};

export default AppBarComponent;
