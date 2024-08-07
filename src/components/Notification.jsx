import React from 'react';
import { Alert, Snackbar } from '@mui/material';

const Notification = ({ open, message, onClose }) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={onClose}
        >
            <Alert onClose={onClose} severity='info'>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default Notification;
