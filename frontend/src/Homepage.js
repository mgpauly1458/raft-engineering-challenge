// HomePage.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Box,
  CircularProgress,
} from '@mui/material';
import Map from './Map';
import Sidebar from './Sidebar';

const HomePage = () => {
  
  // set default center to middle of oahu
  const [center, setCenter] = useState({ lat: 21.3069, lng: -157.8583 });
  const [defaultParks, setDefaultParks] = useState([]);
  const [currentParkIds, setCurrentParkIds] = useState([]);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [userQuery, setUserQuery] = useState('');

  const fetchAiParks = useCallback(async () => {
    try {
      const response = await fetch('/api/parks/ai', {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const parkObjectIds = data.parkObjectIds || [];
      if (parkObjectIds.length > 0) {
        return parkObjectIds;
      }
      return []; // Fallback to default parks if no AI parks found

    } catch (error) {
      console.error('Error fetching AI parks:', error);
    }
  }, []);

  const fetchDefaultParks = useCallback(async () => {
    setIsMapLoading(true);
    try {
      const response = await fetch('/api/parks/default');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setDefaultParks(data);
      const parkObjectIds = await fetchAiParks();
      if (parkObjectIds && parkObjectIds.length > 0) {
      setCurrentParkIds(parkObjectIds);
      } else {
        setCurrentParkIds(data.map(park => park.objectid)); // If no AI parks, show all default parks
      }
      // const currentSummary = await fetchAiSummary();
      // setAiSummary(currentSummary);
    } catch (error) {
      console.error('Error fetching parks:', error);
    } finally {
      setIsMapLoading(false);
    }
  }, [fetchAiParks]);

  useEffect(() => {
    fetchDefaultParks();
  }, [fetchDefaultParks]);

  const handleSearchComplete = useCallback((parkIds, userQuery) => {
    setCurrentParkIds(parkIds);
    setUserQuery(userQuery);
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            Park Search
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Container maxWidth="xl" sx={{ flexGrow: 1, display: 'flex', py: 2 }}>
        <Sidebar 
          currentParkIds={currentParkIds}
          defaultParks={defaultParks}
          onSearchComplete={handleSearchComplete}
          userCriteria={userQuery}
        />

        {/* Map Container */}
        <Paper
          elevation={3}
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '0',
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            {isMapLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Map
                  center={center}
                  zoom={13}
                  parks={defaultParks.filter(park => currentParkIds.includes(park.objectid))}
                />
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage;