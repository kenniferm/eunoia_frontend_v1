import React, { useEffect, useState, useRef } from 'react';
import { Container, Typography, Box, IconButton, Avatar, LinearProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, CircularProgress } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CloseIcon from '@mui/icons-material/Close';
import MicIcon from '@mui/icons-material/Mic';
import SpeakerIcon from '@mui/icons-material/VolumeUp';
import Vapi from '@vapi-ai/web';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

const vapi = new Vapi('bfb9f705-b723-4c52-94dd-bba505f82863'); // Initialize Vapi with your public key
const assistantOptions = '1dc27c2a-8787-45ce-823f-4a9766459364';

const SessionPage = () => {
  const navigate = useNavigate();
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [activeTranscript, setActiveTranscript] = useState(null);
  const [showPublicKeyInvalidMessage, setShowPublicKeyInvalidMessage] = useState(false);
  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const onCallStart = () => {
      setConnecting(false);
      setConnected(true);
      setShowPublicKeyInvalidMessage(false);
      startProgressBar();
      setStartTime(new Date());
    };

    const onCallEnd = () => {
      setConnecting(false);
      setConnected(false);
      setShowPublicKeyInvalidMessage(false);
      stopProgressBar();
      setEndTime(new Date());
      setSummaryOpen(true);
    };

    const onMessage = (message) => {
      if (message.type === 'transcript') {
        setMessages((prev) => [...prev, message]);
        setActiveTranscript(null);
      } else if (message.type === 'transcript' && message.transcriptType === 'partial') {
        setActiveTranscript(message);
      }
    };

    const onError = (error) => {
      setConnecting(false);
      if (isPublicKeyMissingError({ vapiError: error })) {
        setShowPublicKeyInvalidMessage(true);
      }
    };

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('error', onError);

    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('error', onError);
      stopProgressBar();
    };
  }, []);

  const startCallInline = () => {
    setConnecting(true);
    vapi.start(assistantOptions)
      .then((res) => {
        console.log('call', res);
      })
      .catch((err) => {
        console.error('Error starting call', err);
      });
  };

  const endCall = async () => {
    vapi.stop();
    const duration = (new Date() - startTime) / 60000; // Duration in minutes
    const token = localStorage.getItem('token');
    await api.post('/user/session', { date: startTime, duration }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const startProgressBar = () => {
    setProgress(0);
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / (30 * 60));
        if (newProgress >= 100) {
          clearInterval(timerRef.current);
          return 100;
        }
        return newProgress;
      });
    }, 1000);
  };

  const stopProgressBar = () => {
    clearInterval(timerRef.current);
    setProgress(0);
  };

  const handleCloseSummary = () => {
    setSummaryOpen(false);
  };

  const getDuration = () => {
    if (startTime && endTime) {
      const duration = (endTime - startTime) / 1000;
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      return `${minutes} minutes and ${seconds} seconds`;
    }
    return '';
  };

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        backgroundColor: '#e0ecf8',
        padding: '20px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          mb: 2,
        }}
      >
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">Session</Typography>
        <Avatar alt="User Avatar" src="/static/images/avatar/1.jpg" />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
        <IconButton edge="start" color="inherit" aria-label="calendar">
          <CalendarTodayIcon />
        </IconButton>
        <Typography variant="h4">eunoia</Typography>
        <IconButton edge="end" color="inherit" aria-label="close" onClick={() => navigate('/home')}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <IconButton onClick={startCallInline} disabled={connecting || connected}>
          <MicIcon fontSize="large" sx={{ fontSize: 100 }} />
        </IconButton>
        <Typography variant="body1">Tap to start talking</Typography>
        <Box sx={{ width: '100%', mt: 4 }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
        {connecting && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
            <CircularProgress />
            <Typography variant="body1">Connecting...</Typography>
          </Box>
        )}
        {connected && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <SpeakerIcon fontSize="large" />
            </motion.div>
            <Typography variant="body1">Connected</Typography>
          </Box>
        )}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100px',
            height: '40px',
            borderRadius: '20px',
            backgroundColor: '#c0c0c0',
            cursor: 'pointer',
            mt: 4,
          }}
          onClick={endCall}
        >
          <Typography variant="body1">Stop</Typography>
        </Box>
      </Box>
      {showPublicKeyInvalidMessage && <PleaseSetYourPublicKeyMessage />}
      {/* <Box sx={{ mt: 4, width: '100%', maxHeight: '200px', overflowY: 'auto' }}>
        <Typography variant="h6">Live Transcript</Typography>
        <Box>
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                mb: 1,
              }}
            >
              <Box
                sx={{
                  maxWidth: '70%',
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: message.role === 'user' ? '#0084ff' : '#e0e0e0',
                  color: message.role === 'user' ? 'white' : 'black',
                }}
              >
                {message.transcript || message.content}
              </Box>
            </Box>
          ))}
          {activeTranscript && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                mb: 1,
              }}
            >
              <Box
                sx={{
                  maxWidth: '70%',
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: '#e0e0e0',
                  color: 'grey',
                  fontStyle: 'italic',
                }}
              >
                {activeTranscript.transcript}
              </Box>
            </Box>
          )}
        </Box>
      </Box> */}
      <Dialog open={summaryOpen} onClose={handleCloseSummary}>
        <DialogTitle>Conversation Summary</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The duration of your conversation was {getDuration()}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSummary}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

const PleaseSetYourPublicKeyMessage = () => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '25px',
        left: '25px',
        padding: '10px',
        color: '#fff',
        backgroundColor: '#f03e3e',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      }}
    >
      Is your Vapi Public Key missing? (recheck your code)
    </div>
  );
};

const isPublicKeyMissingError = ({ vapiError }) => {
  return vapiError.message.includes('public key');
};

export default SessionPage;
