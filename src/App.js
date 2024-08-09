import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import GuestSearch from './pages/GuestSearch';
import UploadMedia from './pages/UploadMedia';
import InvitationCreator from './components/InvitationCreator';
import InvitationPage from './pages/InvitationPage';
import ForgotPassword from './pages/ForgotPassword';
import Root from './pages/Root';
import DemoUserPage from './pages/DemoUserPage';
import TableSelector from './pages/DemoPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './utils/protectedRoute';
import UnauthenticatedRoute from './utils/UnauthenticatedRoute';
import OwnerPage from './pages/OwnerPage';
import AdminPage from './pages/AdminPage';
import PrivateRoutes from './utils/PrivateRoutes';

const testingTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#d8b384  ', // Beige
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
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={testingTheme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Root />} />

            {/* Unauthenticated routes */}
            <Route element={<UnauthenticatedRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* Shared routes */}
            <Route path="/guest-search/:projectName" element={<GuestSearch />} />
            <Route path="/upload/:projectName" element={<UploadMedia />} />
            <Route path="/invitation/:projectName" element={<InvitationPage />} />
            <Route path="/demo" element={<TableSelector ownerId={30} guestId={1} />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<PrivateRoutes allowedRoles={['owner', 'admin', 'superadmin']} />}>
                <Route path="/owner/home" element={<OwnerPage />} />
              </Route>
              <Route element={<PrivateRoutes allowedRoles={['admin', 'superadmin']} />}>
                <Route path="/admin/home" element={<AdminPage />} />
              </Route>
              <Route path="/create-invitation" element={<InvitationCreator />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
