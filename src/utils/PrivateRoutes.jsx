// RoleBasedRoutes.jsx
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress } from '@mui/material';

const PrivateRoutes = ({ allowedRoles }) => {
    const { currentUser, loading, isLoggedIn } = useAuth();
    if (loading) return <CircularProgress />;

    if (!isLoggedIn) {
        // Not logged in
        return <Navigate to="/" />;
    }

    if (!currentUser.dbUser.role) {
        // Role not assigned
        return <Navigate to="/" />;
    }

    if (allowedRoles && !allowedRoles.includes(currentUser.dbUser.role)) {
        // Not allowed based on role
        const toRoute = `/${currentUser.dbUser.role}/home`;
        return <Navigate to={toRoute} />;
    }

    // Authorized and has required role
    return <Outlet />;
};

export default PrivateRoutes;
