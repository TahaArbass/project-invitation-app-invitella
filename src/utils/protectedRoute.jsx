// ProtectedRoute.jsx
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { isLoggedIn } = useAuth();

    return (
        <>
            {isLoggedIn ? <Outlet /> : <Navigate to="/" />}
        </>
    );
}

export default ProtectedRoute;

