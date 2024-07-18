import React from "react";
import {
    Typography,
    AppBar,
    Button,
    Card,
    CardActions,
    CardContent, CardMedia, CssBaseline, Grid, Toolbar, Container
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material"
// import Button from '@mui/material/Button';
// import ButtonGroup from '@mui/material/ButtonGroup';

// css base line is used to make sure that the css is consistent across all browsers with default styling
const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const Root = () => {
    // classes is used to apply the custom style to the component
    // const classes = useStyles();

    return (
        <>
            <CssBaseline />
            <AppBar position="relative">
                <Toolbar>
                    <PhotoCamera />
                    <Typography variant="h6">Photo Album</Typography>
                </Toolbar>
            </AppBar>
            <main>
                <div>
                    <Container maxWidth="sm">
                        <Typography variant="h2" align="center" color="textPrimary" gutterBottom mt={7}>
                            Fuck
                        </Typography>
                        <Typography variant="h5" align="center" color="textSecondary" paragraph>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur, quia laudantium sint, vitae architecto necessitatibus libero consequatur eius dignissimos deserunt amet inventore esse doloribus, neque magni ad quod harum iure.
                        </Typography>
                        <div>
                            <Grid container spacing={2} justifyContent="center">
                                <Grid item>
                                    <Button variant="contained" color="secondary" size="large">
                                        See My Photos
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="contained" color="primary" size="large">
                                        No Niggers
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </Container>
                </div>
                {/* <ButtonGroup variant="text" aria-label="Basic button group">
                    <Button>One</Button>
                    <Button>Two</Button>
                    <Button>Three</Button>
                </ButtonGroup> */}

                <Container>
                    <Grid container spacing={4}>
                        {cards.map((card) => (
                            <Grid item key={card} xs={12} sm={6} md={4}>
                                <Card>
                                    <CardMedia
                                        image="https://source.unsplash.com/random"
                                        title="Image Title"
                                    />
                                    <CardContent>
                                        <Typography variant="h2">
                                            Heading
                                        </Typography>
                                        <Typography variant="h5" gutterBottom>
                                            This is a media content
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="medium" color="secondary">View</Button>
                                        <Button size="small" color="primary">Edit</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}

                    </Grid>
                </Container>

            </main>
            <footer>
                <Typography variant="h6" align="center" gutterBottom mt={3}>
                    Footer
                </Typography>
                <Typography variant="subtitle1" align="center" color="textSecondary" mb={3}>
                    Something here to give the footer a purpose
                </Typography>
            </footer>
        </>
    )
};

export default Root;