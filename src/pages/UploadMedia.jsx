import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Typography,
    Box,
    CircularProgress,
    Button,
    TextField,
    Stack,
    IconButton,
    Card,
    CardMedia,
    Grid,
    Snackbar,
    Alert,
} from '@mui/material';
import { Background, Container, StyledAutocomplete, GuestSearchTypography } from '../styles';
import baseURL from '../apiConfig';
import { FileUpload, Folder, Cancel } from '@mui/icons-material';
import bgImage from '../assets/paint3.jpeg';

const UploadMedia = () => {
    const { projectName } = useParams();

    const [guests, setGuests] = useState([]);
    const [selectedGuest, setSelectedGuest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uploadComponentVisible, setUploadComponentVisible] = useState(false);
    const [files, setFiles] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [selectedFilesCount, setSelectedFilesCount] = useState(0);

    const MAX_FILES = 15;
    const MAX_FILE_SIZE_MB = 15;

    useEffect(() => {
        const fetchGuests = async () => {
            try {
                // Fetch project id using project name
                const projectResponse = await axios.get(`${baseURL}/api/projects/title/${projectName}`);
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
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch guests');
                setLoading(false);
            }
        };

        fetchGuests();
    }, [projectName]);

    const handleGuestSelect = (event, value) => {
        setSelectedGuest(value);
        setUploadComponentVisible(true); // Show upload component when guest is selected
    };

    const handleFileInputChange = (event) => {
        const fileList = Array.from(event.target.files);

        // Check file count
        if (files.length + fileList.length > MAX_FILES) {
            setSnackbarMessage(`You cannot upload more than ${MAX_FILES} photos.`);
            setSnackbarOpen(true);
            return;
        }

        // Check file size
        const largeFiles = fileList.filter(file => file.size > MAX_FILE_SIZE_MB * 1024 * 1024);
        if (largeFiles.length > 0) {
            setSnackbarMessage(`Each photo must be smaller than ${MAX_FILE_SIZE_MB} MB.`);
            setSnackbarOpen(true);
            return;
        }

        // Update 'files' state
        setFiles(prevFiles => [...prevFiles, ...fileList]);
        setSelectedFilesCount(prevCount => prevCount + fileList.length);
    };

    const handleRemoveFile = (indexToRemove) => {
        setFiles(prevFiles => prevFiles.filter((file, index) => index !== indexToRemove));
        setSelectedFilesCount(prevCount => prevCount - 1);
    };

    const handleUpload = async () => {
        if (selectedGuest && files.length > 0) {
            try {
                const formData = new FormData();
                files.forEach(file => {
                    formData.append('photos', file);
                });

                // Send upload request to backend
                const uploadResponse = await axios.post(`${baseURL}/api/photos/upload/${selectedGuest.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log('Files uploaded successfully:', uploadResponse.data);

                setFiles([]);
                setUploadComponentVisible(false); // Hide upload component after successful upload
                setSnackbarMessage('Files uploaded successfully!');
                setSnackbarOpen(true);
                setSelectedFilesCount(0); // Reset selected files count
            } catch (error) {
                console.error('Error uploading files:', error);
                setSnackbarMessage('Error uploading files. Please try again.');
                setSnackbarOpen(true);
            }
        } else {
            console.warn('No guest selected or no files to upload.');
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
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
        <Background image_url={bgImage}>
            <Container>
                <Box sx={{
                    background: 'rgba(245, 245, 220, 0.2)', /* Beige color with some transparency */
                    backdropFilter: 'blur(4px)', /* Blur effect */
                    borderRadius: 10,
                    padding: 3,
                    maxHeight: '90vh',
                    maxWidth: '80vw',

                }}>
                    <GuestSearchTypography variant="h3" gutterBottom>
                        Capture the Moments
                    </GuestSearchTypography>
                    <GuestSearchTypography variant="h3" gutterBottom>
                        Share Beautiful Memories  🥰
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
                                sx={{ marginBottom: 2 }}
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

                            {uploadComponentVisible && selectedGuest && (
                                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                                    <label htmlFor="upload-files">
                                        <Button
                                            variant="contained"
                                            component="span"
                                            color="primary"
                                            startIcon={<Folder />}
                                        >
                                            Choose Files
                                        </Button>
                                    </label>
                                    <input
                                        id="upload-files"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileInputChange}
                                        style={{ display: 'none' }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleUpload}
                                        disabled={files.length === 0} // Disable button if no files selected
                                        startIcon={<FileUpload />}
                                    >
                                        Upload
                                    </Button>
                                </Stack>
                            )}
                            {files.length > 0 && selectedGuest && (
                                <Box sx={{ maxHeight: '40vh', overflowY: 'auto' }}>
                                    <Typography variant="subtitle1" color="secondary" sx={{ marginTop: 2, fontWeight: 'bold' }}>
                                        {`Selected files (${selectedFilesCount}/${MAX_FILES})`}
                                    </Typography>
                                    <Grid container spacing={2} sx={{ marginTop: 2 }}>
                                        {files.map((file, index) => (
                                            <Grid item xs={6} md={3} key={index}>
                                                <Card sx={{ position: 'relative' }}>
                                                    <CardMedia
                                                        component="img"
                                                        height="140"
                                                        image={URL.createObjectURL(file)}
                                                        alt={`File ${index + 1}`}
                                                    />
                                                    <IconButton
                                                        sx={{ position: 'absolute', top: 2, right: 2, color: 'red' }}
                                                        onClick={() => handleRemoveFile(index)}
                                                    >
                                                        <Cancel />
                                                    </IconButton>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}
                        </>
                    )}
                </Box>

                {/* Snackbar for displaying upload status */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Container>
        </Background>
    );
};

export default UploadMedia;
