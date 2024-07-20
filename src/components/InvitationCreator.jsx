import React, { useState } from 'react';
import { Button, Typography, Box, Paper, Grid, Card, CardContent, Input } from '@mui/material';
import TextInputForm from './TextInputForm';
import LinkButtonInputForm from './LinkButtonInputForm';
import IconInputForm from './IconInputForm';
import { Home, LocationOn, Event, NotInterested, TextFields, Link, InsertEmoticon, AddPhotoAlternate } from '@mui/icons-material';

const Icons = {
    Home, LocationOn, Event, NotInterested
};

const InvitationCreator = () => {
    const [elements, setElements] = useState([]);
    const [formType, setFormType] = useState(null);

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
            const reader = new FileReader();
            reader.onloadend = () => {
                const backgroundIndex = elements.findIndex(el => el.type === 'background');
                if (backgroundIndex !== -1) {
                    const updatedElements = [...elements];
                    updatedElements[backgroundIndex].url = reader.result;
                    setElements(updatedElements);
                } else {
                    setElements([...elements, { type: 'background', url: reader.result }]);
                }
            };
            reader.readAsDataURL(file);
        }
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
                                backgroundImage: elements.find(el => el.type === 'background') ? `url(${elements.find(el => el.type === 'background').url})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                }}
                            >
                                {elements.filter(el => el.type !== 'background').map((element, index) => (
                                    <Box key={index} sx={{ mb: 2 }}>
                                        {element.type === 'text' && (
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    color: element.textColor,
                                                    fontFamily: element.font,
                                                    fontWeight: element.bold ? 'bold' : 'normal',
                                                    fontStyle: element.italic ? 'italic' : 'normal',
                                                    fontSize: `${element.fontSize}px`,
                                                    textAlign: element.alignment,
                                                }}
                                            >
                                                {element.text}
                                            </Typography>
                                        )}
                                        {element.type === 'linkButton' && (
                                            <Button
                                                variant="contained"
                                                href={element.buttonLink}
                                                target="_blank"
                                                sx={{
                                                    color: element.textColor,
                                                    backgroundColor: element.buttonColor,
                                                    fontSize: element.buttonSize,
                                                    fontFamily: element.fontFamily,
                                                    '&:hover': {
                                                        backgroundColor: `${element.buttonColor}CC`,
                                                    },
                                                }}
                                            >
                                                {element.buttonText}
                                            </Button>
                                        )}
                                        {element.type === 'icon' && (
                                            <Box
                                                component={Icons[element.iconType]}
                                                sx={{
                                                    color: element.iconColor,
                                                    fontSize: `${element.iconSize}px`,
                                                }}
                                            />
                                        )}
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default InvitationCreator;
