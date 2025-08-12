import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';

const ChatWebSocket = ({ newUserQuery, serializedParks, chatContext, setChatContext }) => {
  const [isLoading, setIsLoading] = useState(false); // State to show loading indicator
  const chatContextRef = useRef(chatContext); // Ref to hold the current chat context
  // prod url
  // const webSocketUrl = `https://raft-engineering-challenge-websocket-808421331184.europe-west1.run.app`; // WebSocket server URL
  // dev url
  const webSocketUrl = `ws://localhost:8081`; // WebSocket server URL
  
  const fetchChatContext = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setChatContext(data.chatContext || 'Hello! How can I assist you today?');
    } catch (error) {
      console.error('Error fetching chat context:', error);
    } finally {
      setIsLoading(false);
    }
  }



    const queryLLM = async (newUserQuery, serializedParks, chatContextHistory) => {
    setChatContext(prev => prev + `
User: ${newUserQuery}
System: `);
    const ws = new WebSocket(webSocketUrl);
    ws.onopen = () => {
      const message = {
        newUserQuery: newUserQuery,
        serializedParks: serializedParks,
        chatContextHistory: chatContextHistory
      };
      ws.send(JSON.stringify({ message }));
    };
    ws.onmessage = (event) => {
      setChatContext(prev => prev + event.data); // Append new data to chat context
    };
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setChatContext('Error: Unable to process the request.');
    }
    ws.onclose = async () => {
      // save chat context history
      const response = await fetch('/api/ai/context', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatContext: chatContextRef.current })
      });
      if (!response.ok) {
        console.error('Error saving chat context:', response.statusText);
      } else {
      }
    };
  }

  useEffect(() => {
    if (!chatContext) {
      fetchChatContext();
    }
  }, [chatContext]);

  useEffect(() => {
    chatContextRef.current = chatContext;
  }, [chatContext]);

  useEffect(() => {
    if (newUserQuery) {
      queryLLM(newUserQuery, serializedParks, chatContext);
    }
  }, [newUserQuery]);

  return (
    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" component="h4" gutterBottom>
            Planning Assistant
        </Typography>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          width: '100%',
          maxWidth: '600px',
          minHeight: '200px',
          bgcolor: '#f5f5f5',
          borderRadius: 2,
          overflowY: 'auto',
        }}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {!isLoading ? chatContext : <CircularProgress size={24} />}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ChatWebSocket;