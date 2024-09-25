import React, { useState } from 'react';
import { Container, Typography, Box, Button, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const terms = [
  {
    title: 'Self-Help Agreement',
    content: 'I understand that people vary in their responses to the app. There are no promises of improvement for users of the app.',
  },
  {
    title: 'Suicidality Agreement',
    content: 'If I have any suicidal or violent thoughts or urges, I will immediately call 911 and seek help from a mental health professional.',
  },
  {
    title: 'Treatment Waiver',
    content: 'I understand the app does not replace treatment or advice from a healthcare provider.',
  },
  {
    title: 'Expectations Agreement',
    content: 'I understand the app is an automated self-help tool for general wellness. The app does not establish a doctor-patient relationship and does not replace treatment from a healthcare provider. The app is not capable of intervening in an emergency.',
  },
];

const TermsPage = () => {
  const navigate = useNavigate();
  const [acceptedTerms, setAcceptedTerms] = useState(Array(terms.length).fill(false));
  const [allAccepted, setAllAccepted] = useState(false);

  const handleAcceptTerm = (index) => {
    const newAcceptedTerms = [...acceptedTerms];
    newAcceptedTerms[index] = !newAcceptedTerms[index];
    setAcceptedTerms(newAcceptedTerms);
    setAllAccepted(newAcceptedTerms.every(term => term));
  };

  const handleComplete = async () => {
    if (allAccepted) {
      try {
        const token = localStorage.getItem('token');
        await api.post('/user/complete-onboarding', {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        navigate('/home');
      } catch (error) {
        console.error('Failed to complete onboarding:', error);
        alert('An error occurred while completing onboarding. Please try again.');
      }
    } else {
      alert('You must accept all terms to continue.');
    }
  };

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start', // Align to the left
        height: '100vh',
        textAlign: 'left', // Align text to the left
        backgroundColor: '#f0f4f8',
        padding: '20px',
      }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Terms of Use
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        You must agree to the following policies to use Eunoia.
      </Typography>
      {terms.map((term, index) => (
        <Box key={index} sx={{ mb: 2, width: '100%' }}>
          <Typography variant="h6">{term.title}</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>{term.content}</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={acceptedTerms[index]}
                onChange={() => handleAcceptTerm(index)}
              />
            }
            label="I agree"
          />
        </Box>
      ))}
      <Button
        variant="contained"
        color="primary"
        onClick={handleComplete}
        sx={{ mt: 4 }}
        disabled={!allAccepted}
      >
        Complete
      </Button>
    </Container>
  );
};

export default TermsPage;
