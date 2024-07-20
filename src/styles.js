import { Box, TextField, Button, Autocomplete, Typography } from '@mui/material';
import { styled } from '@mui/system';

export const Background = styled(Box)(({ theme, image_url }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    width: '100%',
    backgroundImage: `url(${image_url})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: -1,
}));

export const Container = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    position: 'relative',
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(3),
    },
}));

export const Form = styled('form')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '450px',
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[5],
    backdropFilter: 'blur(70px)',  // Adding the blur effect
    backgroundColor: 'rgba(255, 255, 255, 0.15)',  // Adding some transparency
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
}));

export const StyledSignButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    alignSelf: 'center',
    [theme.breakpoints.down('sm')]: {
        width: '50%',
    }
}));

export const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
    width: '100%',
    borderRadius: 3,
}));

export const GuestSearchTypography = styled(Typography)(({ theme }) => ({
    textAlign: 'center',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
    color: theme.palette.secondary.main,
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontFamily: 'Alegreya',
    marginBottom: theme.spacing(1.5),
    [theme.breakpoints.down('sm')]: {
        fontSize: '1.6rem',
    }
}));