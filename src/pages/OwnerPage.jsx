import React from 'react';
import { useAuth } from '../context/AuthContext';
import OwnerContainer from '../components/OwnerContainer';

const OwnerPage = () => {
    const { currentUser } = useAuth();

    return (
        <OwnerContainer owner={currentUser} />
    );
}

export default OwnerPage;