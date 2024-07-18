// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import GuestSearch from './pages/GuestSearch';
import UploadMedia from './pages/UploadMedia';
import InvitationCreator from './components/InvitationCreator';
import InvitationPage from './pages/InvitationPage';
// import DemoPage from './pages/DemoPage';

const testingTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#d8b384', // Beige
      light: '#f0e1c0', // Light Beige
      dark: '#aa8c5e', // Dark Beige
    },
    secondary: {
      main: '#001f3f', // Navy Blue
      light: '#334d70', // Light Navy Blue
      dark: '#00001f', // Dark Navy Blue
    },
    myCustomColor: {
      main: '#2b2b2b', // Dark gray
    },
    accent: {
      main: '#FF6F61', // Coral
    },
    // background: {
    //   default: '#2b2b2b', // Dark gray
    //   paper: '#1d1d1d', // Slightly lighter dark gray
    // },
    // text: {
    //   primary: '#e0e0e0', // Light gray
    //   secondary: '#b0b0b0', // Softer gray
    // },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={testingTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path='/guest-search/:projectName' element={<GuestSearch />} />
          <Route path='/upload/:projectName' element={<UploadMedia />} />
          <Route path='/' element={<InvitationPage />} />
          <Route path='/create-invitation' element={<InvitationCreator />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
