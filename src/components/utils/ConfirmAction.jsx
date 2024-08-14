// ConfirmAction.jsx
// This component is used to show a dialog box to confirm an action.
import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const ConfirmAction = ({ open, onClose, onConfirm, title, content }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={onConfirm} color="error">
                    Confirm
                </Button>
                <Button variant='outlined' onClick={onClose} color="info">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmAction;
