// frontend/src/SearchBar.js
import React, { useState, useCallback } from 'react';
import {
  TextField,
  Button,
  CircularProgress,
  Box
} from '@mui/material';

const SearchBar = ({ onSearchComplete, defaultParks, currentParkIds, onReset }) => {
  const [userCriteria, setUserCriteria] = useState('');
  const [userCriteriaError, setUserCriteriaError] = useState('');
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);

  const isSearchValid = useCallback(() => {
    let isValid = true;
    if (!userCriteria.trim() || userCriteria.trim().length < 3 || userCriteria.trim().length > 100) {
      setUserCriteriaError('Search criteria must be between 3 and 100 characters');
      isValid = false;
    } else {
      setUserCriteriaError('');
    }
    return isValid;
  }, [userCriteria]);

  const queryAiParks = useCallback(async () => {
    if (!isSearchValid()) return;
    setIsSearchLoading(true);
    try {
      const response = await fetch('/api/parks/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentParkIds: currentParkIds,
          userCriteria: userCriteria,
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      onSearchComplete(data.parkObjectIds, userCriteria);
    } catch (error) {
      console.error('Error fetching AI parks:', error);
    } finally {
      setIsSearchLoading(false);
    }
  }, [isSearchValid, currentParkIds, userCriteria, onSearchComplete]);

  const fetchResetAi = useCallback(async () => {
    setIsResetLoading(true);
    try {
      const response = await fetch('/api/parks/ai/reset', {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      onSearchComplete(defaultParks.map(park => park.objectid), ''); // Reset to default parks
      onReset();
    } catch (error) {
      console.error('Error resetting parks:', error);
    } finally {
      setIsResetLoading(false);
    }
  }, [defaultParks, onSearchComplete, onReset]);

  return (
    <>
      <TextField
        fullWidth
        label="Search"
        variant="outlined"
        value={userCriteria}
        onChange={(e) => setUserCriteria(e.target.value)}
        sx={{ mt: 2 }}
        error={!!userCriteriaError}
        helperText={userCriteriaError ? userCriteriaError : 'Enter search criteria'}
      />
      <Box sx={{ display: 'flex', mt: 2 }}>
        {isSearchLoading ? <CircularProgress sx={{mr: 2}} /> : (
          <Button
            variant="contained"
            color="primary"
            onClick={queryAiParks}
          >
            Search
          </Button>
        )}
        {isResetLoading ? <CircularProgress /> : (
          <Button
            variant="outlined"
            color="secondary"
            onClick={fetchResetAi}
            sx={{ ml: 1 }}
          >
            Reset
          </Button>
        )}
      </Box>
    </>
  );
};

export default SearchBar;
