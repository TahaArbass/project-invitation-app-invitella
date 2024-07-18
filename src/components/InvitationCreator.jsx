import React, { useState } from 'react';
import { Button, Typography, Box, Paper, Grid } from '@mui/material';
import TextInputForm from './TextInputForm';
import ButtonInputForm from './ButtonInputForm';
import LinkButtonInputForm from './LinkButtonInputForm';
import IconInputForm from './IconInputForm';
import * as Icons from '@mui/icons-material';

const InvitationCreator = () => {
    const [elements, setElements] = useState([]);
    const [formType, setFormType] = useState(null);

    const handleAddText = (jsonObject) => {
        setElements([...elements, { type: 'text', ...jsonObject }]);
        setFormType(null);
    };

    const handleAddButton = (jsonObject) => {
        setElements([...elements, { type: 'button', ...jsonObject }]);
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

    const renderForm = () => {
        switch (formType) {
            case 'text':
                return <TextInputForm onGenerateJSON={handleAddText} />;
            case 'button':
                return <ButtonInputForm onGenerateJSON={handleAddButton} />;
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
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={() => setFormType('text')}>
                        Add Text
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={() => setFormType('button')}>
                        Add Button
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={() => setFormType('linkButton')}>
                        Add Link Button
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={() => setFormType('icon')}>
                        Add Icon
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    {renderForm()}
                </Grid>
            </Grid>
            <Paper sx={{ p: 2, mt: 3 }}>
                <Typography variant="h6">Preview</Typography>
                {elements.map((element, index) => (
                    <Box key={index} sx={{ mt: 2 }}>
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
                        {element.type === 'button' && (
                            <Button
                                variant="contained"
                                sx={{
                                    color: element.textColor,
                                    backgroundColor: element.buttonColor,
                                    fontSize: element.buttonSize,
                                    '&:hover': {
                                        backgroundColor: `${element.buttonColor}CC`,
                                    },
                                }}
                            >
                                {element.buttonText}
                            </Button>
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
            </Paper>
        </Box>
    );
};

export default InvitationCreator;
