import React, { useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const cards = [
    { id: 1, title: 'Card 1', content: 'Content for Card 1' },
    { id: 2, title: 'Card 2', content: 'Content for Card 2' },
    { id: 3, title: 'Card 3', content: 'Content for Card 3' },
];

const InvitationPage = () => {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [startX, setStartX] = useState(null);
    const [offsetX, setOffsetX] = useState(0);
    const [dragging, setDragging] = useState(false);

    const handleStart = (clientX) => {
        setStartX(clientX);
        setDragging(true);
    };

    const handleMove = (clientX) => {
        if (!dragging || startX === null) return;

        const difference = clientX - startX;
        setOffsetX(difference);
    };

    const handleEnd = () => {
        if (!dragging || startX === null) return;

        const threshold = 100; // Adjust this threshold as needed
        const direction = Math.sign(offsetX);

        if (Math.abs(offsetX) > threshold) {
            const newIndex = currentCardIndex - direction;
            if (newIndex >= 0 && newIndex < cards.length) {
                setCurrentCardIndex(newIndex);
            }
        }

        // Reset drag state
        setStartX(null);
        setOffsetX(0);
        setDragging(false);
    };

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '100vh',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            onMouseDown={(e) => handleStart(e.clientX)}
            onMouseMove={(e) => handleMove(e.clientX)}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={(e) => handleStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX)}
            onTouchEnd={handleEnd}
        >
            <div
                style={{
                    position: 'relative',
                    width: '80%', // Adjust container width as needed
                    maxWidth: '400px', // Set a max width to prevent squishing content
                    height: '80%', // Adjust container height as needed
                    overflow: 'hidden',
                }}
            >
                {cards.map((card, index) => (
                    <Card
                        key={card.id}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: index === currentCardIndex ? offsetX : index < currentCardIndex ? '-100%' : '100%',
                            transform: `translateX(${offsetX}px)`,
                            transition: dragging ? 'none' : 'transform 0.5s cubic-bezier(0.3, 0.75, 0.5, 1)',
                            background: '#1d1d1d',
                            color: '#e0e0e0',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                            borderRadius: 8,
                            padding: '20px',
                            boxSizing: 'border-box',
                            width: '100%',
                            height: '100%',
                            zIndex: index === currentCardIndex ? 1 : 0,
                        }}
                    >
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {card.title}
                            </Typography>
                            <Typography variant="body2" component="p">
                                {card.content}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default InvitationPage;
