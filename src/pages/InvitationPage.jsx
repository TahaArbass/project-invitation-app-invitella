import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, IconButton, Box, CircularProgress } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import { Background, Container } from '../styles';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import RenderJSON from '../components/RenderJSON';
import { useParams } from 'react-router-dom';
import api from '../utils/api';

const InvitationPage = () => {
    const { projectName } = useParams();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [bgUrl, setBgUrl] = useState('');
    const [elements, setElements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);


    useEffect(() => {
        // Fetch project and pages data, also ge the user data
        const fetchPages = async () => {
            try {
                const projectResponse = await api.get(`/api/projects/title/${projectName}`);
                if (projectResponse.data && projectResponse.data.id) {
                    // get the user data
                    const userResponse = await api.get(`/api/users/${projectResponse.data.owner_id}`);
                    setUser(userResponse.data);
                    console.log('User:', userResponse.data);
                    // get the pages data
                    const pagesResponse = await api.get(`/api/pages/project/${projectResponse.data.id}`);
                    console.log('Pages:', pagesResponse.data);
                    if (pagesResponse.data && pagesResponse.data.length > 0) {
                        const firstPage = pagesResponse.data[0];
                        setBgUrl(firstPage.page_data[0]?.background?.url || '');
                        setElements(pagesResponse.data);
                    } else {
                        setBgUrl('');
                        setElements([]);
                    }
                } else {
                    setBgUrl('');
                    setElements([]);
                }
            } catch (error) {
                console.error('Failed to fetch project or pages:', error);
                setBgUrl('');
                setElements([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPages();
    }, [projectName]);

    const handleSlideChange = (swiper) => {
        setCurrentSlide(swiper.activeIndex);
    };
    useEffect(() => {
        if (elements.length > 0 && elements[currentSlide]?.page_data) {
            const currentBgUrl = elements[currentSlide].page_data.find(el => el.type === 'background')?.url || '';
            setBgUrl(currentBgUrl);
        }
    }, [currentSlide, elements]);

    // if user is not activated, we don't show the invitation
    if (user && !user.isActivated) {
        return (
            <Container>
                <Card sx={{ padding: '20px', margin: '20px', borderRadius: '20px' }}>
                    <CardContent>
                        <Typography variant="h6">
                            Invitation is not available. User Account is not activated.
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        );
    }


    return (
        <Background image_url={bgUrl}>
            <Container>
                {loading ? (
                    <CircularProgress />
                ) : elements.length > 0 ? (
                    <>
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
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                            }}
                        >
                            {elements.map((page, index) => (
                                <SwiperSlide key={index} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Card sx={{
                                        width: '100%',
                                        height: '83vh',
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(1px)',
                                        borderRadius: '20px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
                                    }}>
                                        <CardContent sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            overflowY: 'auto',
                                            overflowX: 'hidden',
                                        }}>
                                            <RenderJSON elements={page.page_data} /> {/* Pass page data */}
                                        </CardContent>
                                    </Card>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: '7px',
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
                            {currentSlide < elements.length - 1 && (
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
                    </>
                ) : (
                    <Typography variant="h6">
                        No Invitation Available.
                    </Typography>
                )}
            </Container>
        </Background>
    );
};

export default InvitationPage;
