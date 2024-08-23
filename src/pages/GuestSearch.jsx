import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Typography,
    Box,
    TextField,
    CircularProgress, Card, CardContent
} from '@mui/material';
import { Background, Container, StyledAutocomplete, GuestSearchTypography } from '../styles';
import baseURL from '../apiConfig';
import bgImage from '../assets/paint2.jpeg';

const GuestSearch = () => {
    const { projectName } = useParams();

    const [guests, setGuests] = useState([]);
    const [guestTables, setGuestTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [selectedGuest, setSelectedGuest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchGuestsAndTables = async () => {
            try {
                // Fetch project id using project name
                const projectResponse = await axios.get(`${baseURL}/api/projects/title/${projectName}`);

                // fetch the owner of the project
                const userResponse = await axios.get(`${baseURL}/api/users/public/${projectResponse.data.owner_id}`, {
                    headers: {
                        public: 'true',
                    },
                });
                setUser(userResponse.data);

                // Fetch guest tables associated with the project
                const guestTablesResponse = await axios.get(`${baseURL}/api/guestTables/project/${projectResponse.data.id}`);
                const fetchedGuestTables = guestTablesResponse.data;
                // Extract guest IDs from guestTables
                const guestIds = fetchedGuestTables.map(guestTable => guestTable.guest_id);

                // Fetch details of each guest using guest IDs
                const guestPromises = guestIds.map(async (guestId) => {
                    const guestResponse = await axios.get(`${baseURL}/api/guests/${guestId}`);
                    return guestResponse.data;
                });

                // Resolve all guest details promises
                const fetchedGuests = await Promise.all(guestPromises);

                // Update state with fetched data
                setGuests(fetchedGuests);
                setGuestTables(fetchedGuestTables);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch guests and guest tables');
                setLoading(false);
            }
        };

        fetchGuestsAndTables();
    }, [projectName]);

    const handleGuestSelect = async (event, value) => {
        setSelectedGuest(value);

        // Check if value is not null or undefined
        if (value) {
            // Find the table associated with the selected guest
            const table = guestTables.find(guestTable => guestTable.guest_id === value.id);
            if (table.table_id) {
                try {
                    // Fetch table details based on table_id from guestTables
                    const tableResponse = await axios.get(`${baseURL}/api/tables/${table.table_id}`);
                    setSelectedTable(tableResponse.data);
                } catch (error) {
                    setError('Failed to fetch table details');
                }
            } else {
                setSelectedTable(null); // Reset selectedTable if no matching table found
            }
        } else {
            setSelectedTable(null); // Reset selectedTable if value is null or undefined
        }
    };


    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // if user is not activated, we don't show the invitation
    if (user && !user.isActivated) {
        return (
            <Container>
                <Card sx={{ padding: '20px', margin: '20px', borderRadius: '20px' }}>
                    <CardContent>
                        <Typography variant="h6">
                            Invitation is not available. User Account is not activated.
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
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
        <Background image_url={bgImage}>
            <Container>
                <Box sx={{
                    background: 'rgba(245, 245, 220, 0.2)', /* Beige color with some transparency */
                    backdropFilter: 'blur(2px)', /* Blur effect */
                    borderRadius: 10,
                    padding: 3,
                }}>
                    <GuestSearchTypography variant="h3" gutterBottom>
                        We are Pleased to Have You!
                    </GuestSearchTypography>
                    <GuestSearchTypography variant="h3" gutterBottom>
                        Find Your Seat and Enjoy the Event
                    </GuestSearchTypography>
                    {guests.length === 0 ? (
                        <GuestSearchTypography variant="h4" color="textSecondary">
                            No guests available at the moment.
                        </GuestSearchTypography>
                    ) : (
                        <>
                            {/* Autocomplete for selecting guests */}
                            <StyledAutocomplete
                                options={guests}
                                id='search-guest-autocomplete'
                                getOptionLabel={(option) => option.first_name + ' ' + option.last_name}
                                onChange={handleGuestSelect}
                                renderInput={(params) =>
                                    <TextField {...params} key={params.id} label="Enter Guest Name" variant="outlined" color='secondary'
                                        InputProps={{
                                            ...params.InputProps,
                                            sx: {
                                                // color: '#000080', // Navy Blue color for the text input
                                                fontSize: 24,
                                            },
                                        }} InputLabelProps={{
                                            sx: {
                                                // color: '#000080', // Navy Blue color for the label text
                                                fontWeight: 'bold',
                                            },
                                        }} />}
                            />
                        </>
                    )}

                    {selectedGuest && (
                        <Box sx={{ marginTop: 4, textAlign: 'center' }}>
                            <GuestSearchTypography variant="h3">Guest: {selectedGuest.first_name} {selectedGuest.last_name}</GuestSearchTypography>
                        </Box>
                    )}

                    {selectedTable ? (
                        <Box sx={{ marginTop: 2, textAlign: 'center' }}>
                            <GuestSearchTypography variant="h3">Table: {selectedTable.label}</GuestSearchTypography>
                            <GuestSearchTypography variant="h4">Where: {selectedTable.description}</GuestSearchTypography>
                        </Box>
                    ) : (
                        <Box sx={{ marginTop: 2, textAlign: 'center' }}>
                            <GuestSearchTypography variant="h4" color="textSecondary">No table Assigned to the Selected Guest</GuestSearchTypography>
                        </Box>
                    )}


                </Box>
            </Container>
        </Background>
    );
};

export default GuestSearch;
