// UnauthenticatedRoute.jsx
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UnauthenticatedRoute = () => {
    const { isLoggedIn } = useAuth();

    return (
        <>
            {!isLoggedIn ? <Outlet /> : <Navigate to="/demo-user" />}
        </>
    );
}

export default UnauthenticatedRoute;