// UnauthenticatedRoute.jsx
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UnauthenticatedRoute = () => {
    const { isLoggedIn, currentUser } = useAuth();

    return (
        <>
            {!isLoggedIn ? <Outlet /> : <Navigate to={'/' + currentUser.dbUser.role + '/home'} />}
        </>
    );
}

export default UnauthenticatedRoute;