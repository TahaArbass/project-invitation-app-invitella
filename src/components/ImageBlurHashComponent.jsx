import React, { useState } from 'react';
import { CardMedia, Box } from '@mui/material';
import { Blurhash } from 'react-blurhash';

const ImageWithBlurhash = ({ imageUrl, blurhash, height = 140 }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <Box sx={{ position: 'relative', height, width: '100%', overflow: 'hidden' }}>
            {!isLoaded && (
                <Blurhash
                    hash={blurhash}
                    width="100%"
                    height={height}
                    resolutionX={32}
                    resolutionY={32}
                    punch={1}
                />
            )}
            <CardMedia
                component="img"
                image={imageUrl}
                loading='lazy'
                onLoad={() => setIsLoaded(true)}
                sx={{
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 0.4s ease-in-out',
                    height: height,
                    width: '100%',
                    objectFit: 'contain',
                }}
            />
        </Box>
    );
};

export default ImageWithBlurhash;
