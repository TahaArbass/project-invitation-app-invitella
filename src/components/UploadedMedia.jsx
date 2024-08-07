import axios from 'axios';
import React, { useEffect, useState } from 'react';
import baseURL from '../apiConfig';
import { useProject } from './OwnerContainer';
import Notification from './Notification';
import { Card, Grid, Typography, CircularProgress, Box, Checkbox, Button, CardActionArea, LinearProgress } from '@mui/material';
import { saveAs } from 'file-saver';
import ImageWithBlurhash from './ImageBlurHashComponent';
import ConfirmAction from './utils/ConfirmAction';

const UploadedMedia = () => {
    const { selectedProject } = useProject();
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ open: false, message: '' });
    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const [downloading, setDownloading] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    useEffect(() => {
        if (!selectedProject?.id) return; // Prevent fetching if no project ID

        setLoading(true);

        axios.get(`${baseURL}/api/photos/project/${selectedProject.id}`)
            .then((response) => {
                setPhotos(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setNotification({ open: true, message: 'Failed to load photos' });
                setLoading(false);
            });
    }, [selectedProject]);

    const handleSelect = (photo) => {
        setSelectedPhotos((prevSelected) =>
            prevSelected.includes(photo)
                ? prevSelected.filter((p) => p !== photo)
                : [...prevSelected, photo]
        );
    };

    const handleDownload = () => {
        setDownloading(true);
        const downloadPromises = selectedPhotos.map((photo) => {
            const downloadUrl = `${baseURL}/api/photos/download/${encodeURIComponent(photo.url)}`;
            return axios.get(downloadUrl, { responseType: 'blob' })
                .then(response => {
                    const fileName = photo.url.split('?')[0].split('/').pop();
                    saveAs(response.data, fileName);
                });
        });

        Promise.all(downloadPromises)
            .then(() => {
                setNotification({ open: true, message: 'Photo(s) downloaded successfully' });
                setSelectedPhotos([]);
                setDownloading(false);
            })
            .catch(() => {
                setNotification({ open: true, message: 'Failed to download photo(s)' });
                setDownloading(false);
            });
    };

    const confirmDelete = () => {
        const deletePromises = selectedPhotos.map((photo) => {
            return axios.delete(`${baseURL}/api/photos/${photo.id}`)
                .then(() => {
                    setPhotos((prevPhotos) => prevPhotos.filter((p) => p.id !== photo.id));
                    setIsConfirmOpen(false);
                });
        });

        Promise.all(deletePromises)
            .then(() => {
                setNotification({ open: true, message: 'Photo(s) deleted successfully' });
                setSelectedPhotos([]);
            })
            .catch(() => {
                setNotification({ open: true, message: 'Failed to delete photo(s)' });
            });
    };

    const handleDelete = () => {
        setIsConfirmOpen(true);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 1, height: 'calc(100vh - 150px)', display: 'flex', flexDirection: 'column' }}>
            <Typography variant='h4' align='center' fontWeight={'bold'} gutterBottom sx={{ mt: 2 }}>
                Uploaded Media
            </Typography>
            {
                selectedPhotos.length > 0 && (
                    <Box display="flex" justifyContent="center" mt={2} gap={6} marginBottom={3} >
                        <Button variant="contained" color="primary" onClick={handleDownload} disabled={downloading}>
                            Download
                        </Button>
                        <Button variant="contained" color='error' onClick={handleDelete} disabled={downloading}>
                            Delete
                        </Button>
                    </Box>
                )
            }
            {downloading && <LinearProgress />}
            <Box sx={{ flex: 1, overflowY: 'auto', p: 1 }}>
                <Grid container spacing={2}>
                    {photos.length > 0 ? (
                        photos.map((photo) => (
                            <Grid item key={photo.id} xs={6} sm={4} md={3} lg={2}>
                                <Card sx={{ borderRadius: 2, boxShadow: 5, position: 'relative' }}>
                                    <CardActionArea onClick={() => handleSelect(photo)}>
                                        <Box sx={{
                                            position: 'relative',
                                            width: '100%',
                                        }}>
                                            <ImageWithBlurhash
                                                imageUrl={photo.url}
                                                blurhash={photo.hashed_url}
                                                height={140}
                                            />
                                        </Box>
                                    </CardActionArea>
                                    <Checkbox
                                        checked={selectedPhotos.includes(photo)}
                                        onChange={() => handleSelect(photo)}
                                        sx={{ position: 'absolute', top: 0, right: 0 }}
                                    />
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Typography variant="h6" align="center">
                                No photos available
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Box>
            <ConfirmAction
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Photo(s)"
                content={`Are you sure you want to delete ${selectedPhotos.length} photo(s)?`}
            />

            <Notification
                open={notification.open}
                message={notification.message}
                onClose={() => setNotification({ open: false, message: '' })}
            />
        </Box >
    );
};

export default UploadedMedia;
