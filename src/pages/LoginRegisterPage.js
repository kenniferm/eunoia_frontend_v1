import React, { useState } from 'react';
import { Container, Typography, TextField, Box, Button } from '@mui/material';

import api from '../api'; // Import the configured Axios instance
import { useNavigate } from 'react-router-dom';

const LoginRegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleRegister = async () => {
    try {
      const response = await api.post('/auth/register', { email, password });
      localStorage.setItem('token', response.data.token); // Save token
      setMessage('Registration successful!');
      navigate('/userinfo'); // Navigate to user info page on successful registration
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed!');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token); // Save token
      const checkUserResponse = await api.get('/auth/checkuser', {
        headers: { Authorization: `Bearer ${response.data.token}` },
      });
      if (checkUserResponse.data.isNewUser) {
        navigate('/userinfo');
      } else {
        navigate('/home');
      }
      setMessage('Login successful!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed!');
    }
  };

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        backgroundColor: '#f7f7e8', // Background color to match the design
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          eunoia
        </Typography>
      </Box>
      <Typography variant="body1" gutterBottom>
        Login or register to meet with eunoia.
      </Typography>
      {/*<Box sx={{ my: 2 }}>
        <Button variant="contained" startIcon={<GoogleIcon />} sx={{ mb: 1, backgroundColor: '#a8d5ba', width: '100%' }}>
          Continue with Google
        </Button>
        <Button variant="contained" startIcon={<AppleIcon />} sx={{ mb: 1, backgroundColor: '#a8d5ba', width: '100%' }}>
          Continue with Apple
        </Button>
        <Button variant="contained" startIcon={<FacebookIcon />} sx={{ mb: 1, backgroundColor: '#a8d5ba', width: '100%' }}>
          Continue with Facebook
        </Button>
      </Box>*/}
      
      <Box sx={{ width: '100%', maxWidth: 360 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ backgroundColor: '#fff' }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ backgroundColor: '#fff' }}
        />
      </Box>
      <Button
        variant="contained"
        sx={{ mt: 2, backgroundColor: '#a8d5ba', width: '100%' }}
        onClick={handleRegister}
      >
        Register
      </Button>
      <Button
        variant="contained"
        sx={{ mt: 2, backgroundColor: '#a8d5ba', width: '100%' }}
        onClick={handleLogin}
      >
        Login
      </Button>
      {message && <Typography variant="body1" sx={{ mt: 2 }}>{message}</Typography>}
      <Typography variant="caption" display="block" sx={{ mt: 4 }}>
        This platform follows strict privacy guidelines and terms of service.
      </Typography>
    </Container>
  );
};

export default LoginRegisterPage;

