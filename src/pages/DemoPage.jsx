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

const TableSelector = () => {
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTables = async () => {
            try {
                // Fetch all tables
                const response = await axios.get(`${baseURL}/api/tables`);
                setTables(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch tables');
                setLoading(false);
            }
        };

        fetchTables();
    }, []);

    const handleTableSelect = (event, value) => {
        setSelectedTable(value);
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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography variant="h4" color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box>
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