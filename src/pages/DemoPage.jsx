import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Typography,
    Box,
    TextField,
    CircularProgress,
    Autocomplete
} from '@mui/material';
import baseURL from '../apiConfig';
import { useAuth } from '../context/AuthContext';

const TableSelector = ({ onSelectTable }) => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchTables = async () => {
            try {
                // Fetch all tables owned by the current user
                const response = await axios.get(`${baseURL}/api/tables/owner/${currentUser.dbUser.id}`);
                setTables(response.data);
                setLoading(false);
            } catch (err) {
                setError('No tables found');
                setLoading(false);
            }
        };

        fetchTables();
    }, [currentUser.dbUser.id]);

    const handleTableSelect = (event, value) => {
        if (onSelectTable)
            onSelectTable(value);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh' }}>
                <Typography variant="h4" color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 1 }}>
            <Autocomplete
                options={tables}
                getOptionLabel={(option) => option.label}
                onChange={handleTableSelect}
                renderInput={(params) =>
                    <TextField {...params} label="Enter Table Label" variant="outlined" />}
            />
        </Box>
    );
};

export default TableSelector;