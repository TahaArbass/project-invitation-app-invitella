import React, { useState } from 'react';
import { Button, Typography, Box, Paper, Grid, Card, CardContent, Input, Snackbar, Alert, LinearProgress } from '@mui/material';
import { TextFields, Link, InsertEmoticon, AddPhotoAlternate } from '@mui/icons-material';
import TextInputForm from './TextInputForm';
import LinkButtonInputForm from './LinkButtonInputForm';
import IconInputForm from './IconInputForm';
import RenderJSON from './RenderJSON';
import { storage } from '../firebase/firebaseConfig'; // Import Firebase storage
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Firebase Storage imports
import baseURL from '../apiConfig';

const InvitationCreator = () => {
    const [elements, setElements] = useState([]);
    const [formType, setFormType] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success', 'error', 'warning', 'info'
    const [backgroundFile, setBackgroundFile] = useState(null); // State for storing the selected background file
    const [uploadProgress, setUploadProgress] = useState(0); // State for tracking upload progress

    const handleAddText = (jsonObject) => {
        setElements([...elements, { type: 'text', ...jsonObject }]);
        setFormType(null);
    };

    const handleAddLinkButton = (jsonObject) => {
        setElements([...elements, { type: 'linkButton', ...jsonObject }]);
        setFormType(null);
    };

    const handleAddIcon = (jsonObject) => {
        setElements([...elements, { type: 'icon', ...jsonObject }]);
        setFormType(null);
    };

    const handleAddBackground = (event) => {
        const file = event.target.files[0];
        if (file) {
            setBackgroundFile(file); // Store the file in state
        }
    };

    const handleSubmit = () => {
        if (elements.length === 0) {
            setSnackbarMessage('Please add at least one element to submit');
            setSnackbarSeverity('warning');
            setSnackbarOpen(true);
            return;
        }

        const uploadPromises = [];
        let hasBackground = false;

        // Handle background image upload if there's a file selected
        if (backgroundFile) {
            const fileName = `${Date.now()}_${backgroundFile.name}`;
            const storageRef = ref(storage, `photos/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, backgroundFile);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    setSnackbarMessage('Upload failed. Please try again.');
                    setSnackbarSeverity('error');
                    setSnackbarOpen(true);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        // Ensure background element is added
                        const updatedElements = elements.filter(el => el.type !== 'background');
                        updatedElements.push({ type: 'background', url: downloadURL });
                        setElements(updatedElements);
                        setUploadProgress(100); // Ensure progress is set to 100% when done
                    }).catch((error) => {
                        setSnackbarMessage('Failed to get download URL. Please try again.');
                        setSnackbarSeverity('error');
                        setSnackbarOpen(true);
                    });
                }
            );

            // Add a promise to the array to handle the upload completion
            uploadPromises.push(new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    null,
                    reject,
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref)
                            .then((downloadURL) => resolve(downloadURL))
                            .catch(reject);
                    }
                );
            }));
        } else {
            // If no background file, resolve immediately
            uploadPromises.push(Promise.resolve());
        }

        // Wait for all uploads to finish, then submit the page
        Promise.all(uploadPromises)
            .then(() => {
                return fetch(`${baseURL}/api/pages`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        page_data: elements,
                        priority: 5,
                        project_id: 11
                    })
                });
            })
            .then(response => response.json())
            .then(data => {
                setSnackbarMessage('Submission successful!');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            })
            .catch((error) => {
                console.error('Error:', error);
                setSnackbarMessage('Submission failed. Please try again.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            });
    };


    const renderForm = () => {
        switch (formType) {
            case 'text':
                return <TextInputForm onGenerateJSON={handleAddText} />;
            case 'linkButton':
                return <LinkButtonInputForm onGenerateJSON={handleAddLinkButton} />;
            case 'icon':
                return <IconInputForm onGenerateJSON={handleAddIcon} />;
            default:
                return null;
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Create Your Invitation</Typography>
            <Grid container spacing={2} justifyContent="center">
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<TextFields />}
                        onClick={() => setFormType('text')}
                    >
                        Add Text
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Link />}
                        onClick={() => setFormType('linkButton')}
                    >
                        Add Link Button
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<InsertEmoticon />}
                        onClick={() => setFormType('icon')}
                    >
                        Add Icon
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddPhotoAlternate />}
                        onClick={() => document.getElementById('bg-input').click()}
                    >
                        Add Background
                    </Button>
                    <Input
                        id="bg-input"
                        type="file"
                        accept="image/*"
                        onChange={handleAddBackground}
                        sx={{ display: 'none' }}
                    />
                </Grid>
            </Grid>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Submit Page
                </Button>
            </Box>
            <Box sx={{ mt: 2 }}>
                {uploadProgress > 0 && (
                    <Box sx={{ width: '50%', margin: '0 auto' }}>
                        <Typography variant="body2" color="textSecondary">Upload Progress: {Math.round(uploadProgress)}%</Typography>
                        <LinearProgress variant="determinate" value={uploadProgress} />
                    </Box>
                )}
            </Box>
            <Box sx={{ mt: 4 }}>
                {renderForm()}
            </Box>
            <Paper sx={{ p: 2, mt: 4 }}>
                <Typography variant="h6">Preview</Typography>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item>
                        <Card
                            sx={{
                                width: '375px', // typical mobile width
                                height: '667px', // typical mobile height
                                p: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    width: '100%',
                                }}
                            >
                                <RenderJSON elements={elements} />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default InvitationCreator;
