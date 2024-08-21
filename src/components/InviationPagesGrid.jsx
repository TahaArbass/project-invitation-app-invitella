import React from 'react';
import { Box, Button, Grid, Card, CardContent, Typography, IconButton } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

const InvitationPagesGrid = ({ pages, onEdit, onDelete, onAdd }) => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Manage Invitation Pages
            </Typography>
            <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={onAdd}
                sx={{ mb: 2 }}
            >
                Add New Page
            </Button>
            <Grid container spacing={2}>
                {pages.map((page, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Page {index + 1}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    {page.title || 'No title'}
                                </Typography>
                                <IconButton onClick={() => onEdit(index)} color="primary">
                                    <Edit />
                                </IconButton>
                                <IconButton onClick={() => onDelete(index)} color="error">
                                    <Delete />
                                </IconButton>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default InvitationPagesGrid;
