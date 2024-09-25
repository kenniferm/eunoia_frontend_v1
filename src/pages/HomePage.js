import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, Paper, Menu, MenuItem } from '@mui/material'; 
import MicIcon from '@mui/icons-material/Mic';
import ChatIcon from '@mui/icons-material/Chat';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const HomePage = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/user/sessions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSessions(response.data);
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
      }
    };

    fetchSessions();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: '#e0ecf8',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }));

  return (
    <>
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          height: 'calc(100vh - 64px)', // Adjust height to subtract the AppBar height
          textAlign: 'center',
          backgroundColor: '#f7f7e8',
          padding: '20px',
          paddingTop: '64px' // Add padding to avoid content overlap with AppBar
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%', my: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <MicIcon fontSize="large" onClick={() => navigate('/session')} />
            <Typography>Talk to eunoia</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ChatIcon fontSize="large" />
            <Typography>Chat with eunoia</Typography>
          </Box>
        </Box>
        <Typography variant="h6" sx={{ alignSelf: 'flex-start', ml: 1 }}>Session History</Typography>
        <Box sx={{ display: 'flex', overflowX: 'scroll', width: '100%', mb: 4 }}>
          {sessions.sort((a, b) => new Date(b.date) - new Date(a.date)).map((session, index) => (
            <StyledPaper key={index} sx={{ minWidth: '200px', mx: 1 }}>
              <Typography variant="h6">Session {index + 1}</Typography>
              <Typography variant="body2">Date: {new Date(session.date).toLocaleDateString()}</Typography>
              <Typography variant="body2">Time: {new Date(session.date).toLocaleTimeString()}</Typography>
              <Typography variant="body2">Duration: {session.duration} minutes</Typography>
            </StyledPaper>
          ))}
        </Box>
        
        <Typography variant="h6" sx={{ alignSelf: 'flex-start', ml: 1 }}>Therapy Content (coming soon)</Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <StyledPaper>
              <Typography>Meditation</Typography>
            </StyledPaper>
          </Grid>
          <Grid item xs={4}>
            <StyledPaper>
              <Typography>Breathing</Typography>
            </StyledPaper>
          </Grid>
          <Grid item xs={4}>
            <StyledPaper>
              <Typography>Calm Sound</Typography>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default HomePage;
