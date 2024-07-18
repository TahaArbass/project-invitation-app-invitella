import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import bgImage from '../assets/paint2.jpeg'
import { Background, Container } from '../styles';

const cards = [
    { id: 1, title: 'Card 1', content: 'Content for Card 1. This is additional content for Card 1 to make it longer and more informative. You can add more details here about the card.' },
    { id: 2, title: 'Card 2', content: 'Content for Card 2. This is additional content for Card 2 to make it longer and more informative. You can add more details here about the card.' },
    { id: 3, title: 'Card 3', content: 'Content for Card 3. This is additional content for Card 3 to make it longer and more informative. You can add more details here about the card.' },
];

const InvitationPage = () => {
    return (
        <Background image_url={bgImage}>
            <Container>
                <Swiper
                    effect="coverflow"
                    centeredSlides={true}
                    loop={false}
                    slidesPerView={1}
                    spaceBetween={200}
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 100,
                        modifier: 2.5,
                    }}
                    pagination={{ clickable: true }}
                    navigation
                    modules={[EffectCoverflow, Pagination, Navigation]}
                    style={{
                        width: '90%', height: '100%', padding: 4, margin: 0,
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                    }}
                >
                    {cards.map((card) => (
                        <SwiperSlide key={card.id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Card style={{ textAlign: 'center', width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(1px)' }}>
                                <CardContent>
                                    <Typography variant="h5" component="h2" gutterBottom>
                                        {card.title}
                                    </Typography>
                                    <Typography variant="body1" component="div">
                                        {card.content}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Container >
        </Background>
    );
};

export default InvitationPage;
