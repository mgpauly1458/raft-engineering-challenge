// frontend/src/Sidebar.js
import React, {useState} from 'react';
import {
  Paper,
  Typography,
} from '@mui/material';
import SearchBar from './SearchBar';
import ChatWebSocket from './ChatWebSocket';

const serializeParkForLLMProcessing = (park) => {
    return {
        objectId: park.objectid,
        name: park.park_name,
        features: getFeaturesOfPark(park),
    }
}

const mapFieldNamesToDisplayNames = {
  // Sports
  first_base: 'Baseball',
  first_soft: 'Softball',
  first_foot: 'Football',
  first_socc: 'Soccer',
  first_rugb: 'Rugby',
  first_bask: 'Basketball',
  first_tenn: 'Tennis',
  first_voll: 'Volleyball',
  first_teth: 'Tetherball',
  first_golf: 'Golf',

    // Outdoor Activities
  first_hiki: 'Hiking',
  first_jogg: 'Jogging',
  first_exer: 'Exercise Fields',
  first_skat: 'Skating',
  first_sk_1: 'Skateboarding',
  first_outr: 'Outrigger Canoe',
  first_picn: 'Picnicking',
  first_camp: 'Camping Tent',
  first_ca_1: 'Camping Trailer',
  first_chil: 'Child Playground',
  first_swim: 'Swimming',
  first_gymn: 'Gymnastics',
  first_indo: 'Indoor Rec',
  first_art_: 'Art Work',
  first_blea: 'Bleacher',
  first_bus_: 'Bus Stop',
  first_co_1: 'Community Garden Plots',
  first_conc: 'Concession',
  first_drin: 'Drinking Water',
  first_ex_1: 'Exercise Area',
  first_hand: 'Handicap Access',
  first_ha_1: 'Handicap Parking Stalls',
  first_hist: 'Historic Site',
  first_land: 'Landscape',
  first_life: 'Lifeguard Towers',
  first_ligh: 'Lights',
  first_park: 'Parking Stalls',
  first_pay_: 'Pay Phone',
  first_pi_1: 'Picnic Tables',
  first_rest: 'Restroom',
  first_shad: 'Shade Tree',
  first_show: 'Shower',
  staffed: 'Staffed',
};

const getFeaturesOfPark = (park) => {
    const features = [];
    // If any field has the value 'T', add the corresponding feature to the list
    for (const [field, displayName] of Object.entries(mapFieldNamesToDisplayNames)) {
        if (park[field] === 'T') {
            features.push(displayName);
        }
    }
    return features;
};


const Sidebar = ({ currentParkIds, defaultParks, onSearchComplete }) => {
    const [newUserQuery, setNewUserQuery] = useState('');
    const [chatContext, setChatContext] = useState('');

    const onSearchSubmit = (parkObjectIds, newUserQuery) => {
    // Filter default parks based on current park IDs
    onSearchComplete(parkObjectIds, newUserQuery || '');
    setNewUserQuery(newUserQuery || '');
  }

  const handleReset = () => {
    setChatContext('System: Hello! How can I assist you today?');
  };

  const currentPArks = defaultParks.filter(park => currentParkIds.includes(park.objectid));
  const serializedParks = JSON.stringify(currentPArks.map(serializeParkForLLMProcessing));
  
    // Filter default parks based on current park IDs
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mr: 2,
        minWidth: '300px',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Parks Summary:
      </Typography>
        <Typography variant="body2" sx={{ flexGrow: 1 }}>
        Currently viewing {currentParkIds.length} parks
      </Typography>
      <ChatWebSocket 
        newUserQuery={newUserQuery}
        serializedParks={serializedParks}
        chatContext={chatContext}
        setChatContext={setChatContext}
      />
      <SearchBar 
        onSearchComplete={onSearchSubmit}
        defaultParks={defaultParks}
        currentParkIds={currentParkIds}
        onReset={handleReset}
      />
    </Paper>
  );
};

export default Sidebar;
