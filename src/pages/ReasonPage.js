import React, { useState } from 'react';
import { Container, Typography, Button, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';
import HearingIcon from '@mui/icons-material/Hearing';
import HelpIcon from '@mui/icons-material/Help';

const reasons = [
  { icon: <EmojiEventsIcon />, text: 'Enhancing performance' },
  { icon: <SentimentVeryDissatisfiedIcon />, text: 'Easing anxiety' },
  { icon: <FavoriteIcon />, text: 'I want to express my emotions' },
  { icon: <SearchIcon />, text: 'Curious to explore more about myself' },
  { icon: <HearingIcon />, text: 'Looking for a listening ear' },
  { icon: <HelpIcon />, text: 'Just wondering' },
];

const ReasonPage = () => {
  const [selectedReason, setSelectedReason] = useState('');
  const navigate = useNavigate();

  const handleContinue = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/user/reason', { reason: selectedReason }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/terms');
    } catch (error) {
      console.error('Failed to save user reason:', error);
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
        backgroundColor: '#f7f7e8',
        padding: '20px',
      }}
    >
      <Typography variant="h4" sx={{ mb: 4 }}>What brings you to eunoia today?</Typography>
      <List sx={{ width: '100%', maxWidth: 360, backgroundColor: '#fff', borderRadius: '20px' }}>
        {reasons.map((reason, index) => (
          <ListItem
            button
            key={index}
            selected={selectedReason === reason.text}
            onClick={() => setSelectedReason(reason.text)}
          >
            <ListItemIcon>{reason.icon}</ListItemIcon>
            <ListItemText primary={reason.text} />
          </ListItem>
        ))}
      </List>
      <Button
        variant="contained"
        sx={{ mt: 2, backgroundColor: '#a8d5ba', width: '100%' }}
        onClick={handleContinue}
        disabled={!selectedReason}
      >
        Continue
      </Button>
    </Container>
  );
};

export default ReasonPage;
