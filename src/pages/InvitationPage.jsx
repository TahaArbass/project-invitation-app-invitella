import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import bgImage from '../assets/paint2.jpeg';
import { Background, Container } from '../styles';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';

const cards = [
    { id: 1, title: 'Card 1', content: 'Content for Card 1...' },
    { id: 2, title: 'Card 2', content: 'Content for Card 2...' },
    { id: 3, title: 'Card 3', content: 'Content for Card 3...' },
];

const InvitationPage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleSlideChange = (swiper) => {
        setCurrentSlide(swiper.activeIndex);
    };

    return (
        <Background image_url={bgImage}>
            <Container>
                <Swiper
                    effect="coverflow"
                    centeredSlides
                    slidesPerView={1}
                    spaceBetween={200}
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 100,
                        modifier: 2.5,
                    }}
                    modules={[EffectCoverflow]}
                    onSlideChange={handleSlideChange}
                    style={{
                        width: '85%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                    }}
                >
                    {cards.map((card) => (
                        <SwiperSlide key={card.id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Card sx={{
                                width: '100%',
                                height: '80vh',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                backdropFilter: 'blur(1px)',
                                borderRadius: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
                            }}>
                                <CardContent sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                    overflowY: 'auto',
                                    overflowX: 'hidden',
                                }}>
                                    <Typography variant="h5" component="h2" gutterBottom>
                                        {card.title}
                                    </Typography>
                                    <Typography variant="body1">
                                        {card.content}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 10,
                        background: 'rgba(0,0,0,0.4)',
                        borderRadius: '20px',
                        padding: '5px 10px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                        pointerEvents: 'none',
                    }}
                >
                    {currentSlide > 0 && (
                        <IconButton
                            sx={{
                                background: 'transparent',
                                color: '#fff',
                            }}
                        >
                            <WestIcon />
                        </IconButton>
                    )}
                    <Typography variant="body1" sx={{ color: '#fff', margin: '0 10px' }}>
                        Swipe
                    </Typography>
                    {currentSlide < cards.length - 1 && (
                        <IconButton
                            sx={{
                                background: 'transparent',
                                color: '#fff',
                            }}
                        >
                            <EastIcon />
                        </IconButton>
                    )}
                </Box>
            </Container>
        </Background>
    );
};

export default InvitationPage;
