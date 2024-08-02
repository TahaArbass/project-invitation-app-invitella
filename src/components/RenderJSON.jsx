import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Home, LocationOn, Event, NotInterested } from '@mui/icons-material';

const Icons = {
    Home, LocationOn, Event, NotInterested
};

const RenderJSON = ({ elements }) => {
    return (
        <>
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
                                whiteSpace: 'pre-wrap',
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
                                margin: 'auto',
                            }}
                        />
                    )}
                </Box>
            ))}
        </>
    );
};

export default RenderJSON;
