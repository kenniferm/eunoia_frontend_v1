import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLaunch = () => {
    navigate('/login');
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
      }}
    >
      <Typography variant="h2" gutterBottom>
        Welcome to Eunoia
      </Typography>
      <Button variant="contained" color="primary" onClick={handleLaunch}>
        Launch
      </Button>
    </Container>
  );
};

export default LandingPage;
