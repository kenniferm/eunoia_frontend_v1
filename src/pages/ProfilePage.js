import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Import the configured Axios instance

const ProfilePage = () => {
  const [profile, setProfile] = useState({});
  const navigate = useNavigate(); // Initialize the navigate hook

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        const response = await api.get('/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        backgroundColor: '#f7f7e8',
        padding: '20px',
      }}
    >
      <Typography variant="h4" sx={{ mb: 4 }}>Profile</Typography>
      <Box sx={{ width: '100%', maxWidth: 360, backgroundColor: '#fff', borderRadius: '20px', padding: '20px' }}>
        <Typography variant="body1"><strong>Name:</strong> {profile.firstName} {profile.lastName}</Typography>
        <Typography variant="body1"><strong>Gender:</strong> {profile.gender}</Typography>
        <Typography variant="body1"><strong>Age:</strong> {profile.age}</Typography>
        <Typography variant="body1"><strong>Reason:</strong> {profile.reason}</Typography>
      </Box>
      <Button
        variant="contained"
        sx={{ mt: 4, backgroundColor: '#a8d5ba' }}
        onClick={() => navigate('/home')} // Add button to navigate to home
      >
        Return to Home
      </Button>
    </Container>
  );
};

export default ProfilePage;
