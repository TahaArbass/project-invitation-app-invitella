import React, { useState } from 'react';
import { Button, Typography, Box, Card, CardContent, Grid, Input, Snackbar, Alert, LinearProgress, IconButton, Dialog } from '@mui/material';
import { TextFields, Link, InsertEmoticon, AddPhotoAlternate, Delete, Edit, Close } from '@mui/icons-material';
import TextInputForm from './Forms/TextInputForm';
import LinkButtonInputForm from './Forms/LinkButtonInputForm';
import IconInputForm from './Forms/IconInputForm';
import RenderJSON from './RenderJSON';
import { signInAnon, storage } from '../firebase/firebaseConfig'; // Import Firebase storage
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Firebase Storage imports
import { useProject } from './OwnerContainer';
import api from '../utils/api';

const InvitationCreator = (page = null) => {
    const [elements, setElements] = useState(page?.page_data || []); // State for storing page elements
    const [formType, setFormType] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success', 'error', 'warning', 'info'
    const [backgroundFile, setBackgroundFile] = useState(null); // State for storing the selected background file
    const [uploadProgress, setUploadProgress] = useState(0); // State for tracking upload progress
    const [editingIndex, setEditingIndex] = useState(null);
    const { selectedProject } = useProject();

    const handleAddText = (jsonObject, index) => {
        if (index !== null) {
            const updatedElements = [...elements];
            updatedElements[index] = { type: 'text', ...jsonObject };
            setElements(updatedElements);
        } else {
            setElements([...elements, { type: 'text', ...jsonObject }]);
        }
        setFormType(null);
        setEditingIndex(null);
    };

    const handleAddLinkButton = (jsonObject, index) => {
        if (index !== null) {
            const updatedElements = [...elements];
            updatedElements[index] = { type: 'linkButton', ...jsonObject };
            setElements(updatedElements);
        } else {
            setElements([...elements, { type: 'linkButton', ...jsonObject }]);
        }
        setFormType(null);
        setEditingIndex(null);
    };

    const handleAddIcon = (jsonObject, index) => {
        if (index !== null) {
            const updatedElements = [...elements];
            updatedElements[index] = { type: 'icon', ...jsonObject };
            setElements(updatedElements);
        } else {
            setElements([...elements, { type: 'icon', ...jsonObject }]);
        }
        setFormType(null);
        setEditingIndex(null);
    };

    const handleAddBackground = (event) => {
        const file = event.target.files[0];
        if (file) {
            setBackgroundFile(file); // Store the file in state
        }
    };

    const handleSubmit = async () => {
        if (elements.length === 0) {
            setSnackbarMessage('Please add at least one element to submit');
            setSnackbarSeverity('warning');
            setSnackbarOpen(true);
            return;
        }

        try {
            let backgroundURL = null;

            if (backgroundFile) {
                // Upload background file to Firebase Storage
                await signInAnon(); // Sign in anonymously to Firebase
                backgroundURL = await uploadFile(backgroundFile);
            }
            const submissionData = {
                page_data: backgroundURL ?
                    [...elements, { type: 'background', url: backgroundURL }] :
                    elements,
                priority: 5,
                project_id: selectedProject.id,
            };

            await submitPage(submissionData);
            setSnackbarMessage('Submission successful!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setBackgroundFile(null);

        } catch (error) {
            console.error('Error:', error);
            setSnackbarMessage('Submission failed. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const uploadFile = async (file) => {
        const fileName = `${Date.now()}_${file.name}`;
        const storageRef = ref(storage, `backgrounds/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                snapshot => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                error => reject(error),
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        setUploadProgress(100); // Ensure progress is set to 100% when done
                        resolve(downloadURL);
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    };


    // Submit page data to the server
    const submitPage = async (data) => {
        const response = await api.post('/api/pages', data);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        setElements([]); // Clear elements after successful submission
        setUploadProgress(0); // Reset upload progress
        return response.json();
    };

    const handleEdit = (index) => {
        setEditingIndex(index);
        const element = elements[index];
        if (element.type === 'text') {
            setFormType('text');
        } else if (element.type === 'linkButton') {
            setFormType('linkButton');
        } else if (element.type === 'icon') {
            setFormType('icon');
        }
    };

    const handleDelete = (index) => {
        setElements(elements.filter((_, i) => i !== index));
    };

    const renderForm = () => {
        if (formType) {
            return (
                <Dialog open={true} onClose={() => { setFormType(null); setEditingIndex(null); }}>

                    <IconButton onClick={() => { setFormType(null); setEditingIndex(null); }}
                        sx={{ position: 'absolute', top: 0, right: 0 }}>
                        <Close />
                    </IconButton>

                    {formType === 'text' && <TextInputForm onGenerateJSON={handleAddText} index={editingIndex} element={elements[editingIndex]} />}
                    {formType === 'linkButton' && <LinkButtonInputForm onGenerateJSON={handleAddLinkButton} index={editingIndex} element={elements[editingIndex]} />}
                    {formType === 'icon' && <IconInputForm onGenerateJSON={handleAddIcon} index={editingIndex} element={elements[editingIndex]} />}
                </Dialog>
            );
        }
        return null;
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" align='center' sx={{ fontWeight: 'bold' }} gutterBottom>Page Editor</Typography>
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<TextFields />}
                        onClick={() => { setFormType('text'); setEditingIndex(null) }}
                    >
                        Add Text
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Link />}
                        onClick={() => { setFormType('linkButton'); setEditingIndex(null) }}
                    >
                        Add Link Button
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<InsertEmoticon />}
                        onClick={() => { setFormType('icon'); setEditingIndex(null) }}
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
            {/* Uplaod progress */}
            {uploadProgress > 0 && (
                <Box sx={{ width: '100%', mt: 2 }}>
                    <LinearProgress variant="determinate" value={uploadProgress} />
                    <Typography variant="caption" display="block" gutterBottom>
                        Uploading background: {Math.round(uploadProgress)}%
                    </Typography>
                </Box>
            )}
            <Box sx={{ mt: 4 }}>
                <Grid container spacing={2}>
                    {elements.map((element, index) => (
                        <Grid item xs={6} sm={5} md={2.5} key={index}>
                            <Box
                                sx={{
                                    p: 2,
                                    border: '2px solid',
                                    borderColor: 'grey.400',
                                    borderRadius: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                }}
                            >
                                <Typography variant="body2">{element.type.toUpperCase()}</Typography>
                                <Box>
                                    <Button onClick={() => handleEdit(index)}>
                                        <Edit />
                                    </Button>
                                    <Button onClick={() => handleDelete(index)}>
                                        <Delete />
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
                <Typography variant="h5" align='center' sx={{ mt: 4, fontWeight: 'bold' }} gutterBottom>Preview</Typography>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item>
                        <Card
                            sx={{
                                width: '375px', // typical mobile width
                                height: '667px', // typical mobile height
                                p: 1,
                                borderRadius: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                backgroundImage: backgroundFile ? `url(${URL.createObjectURL(backgroundFile)})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <CardContent
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    overflowY: 'auto',
                                    overflowX: 'hidden',
                                }}
                            >
                                <RenderJSON elements={elements} />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            {renderForm()}
        </Box>
    );
};

export default InvitationCreator;

