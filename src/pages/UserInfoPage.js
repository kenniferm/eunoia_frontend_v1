import React, { useState } from 'react';
import { Container, Typography, TextField, Box, Button, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const UserInfoPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const navigate = useNavigate();

  const handleContinue = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/user/info', { firstName, lastName, gender, age }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/reason');
    } catch (error) {
      console.error('Failed to save user info:', error);
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
      <Typography variant="h4" sx={{ mb: 4 }}>Let us get your info</Typography>
      <Box sx={{ width: '100%', maxWidth: 360 }}>
        <TextField
          fullWidth
          margin="normal"
          label="First Name"
          variant="outlined"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          sx={{ backgroundColor: '#fff' }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Last Name"
          variant="outlined"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          sx={{ backgroundColor: '#fff' }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Gender"
          variant="outlined"
          select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          sx={{ backgroundColor: '#fff' }}
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="other">Other</MenuItem>
          <MenuItem value="prefer_not_to_say">Prefer not to say</MenuItem>
        </TextField>
        <TextField
          fullWidth
          margin="normal"
          label="Age"
          variant="outlined"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          sx={{ backgroundColor: '#fff' }}
        />
      </Box>
      <Button
        variant="contained"
        sx={{ mt: 2, backgroundColor: '#a8d5ba', width: '100%' }}
        onClick={handleContinue}
      >
        Continue
      </Button>
    </Container>
  );
};

export default UserInfoPage;