// Map.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// Fix for missing icons
import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsRugbyIcon from '@mui/icons-material/SportsRugby';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RollerSkatingIcon from '@mui/icons-material/RollerSkating';
import KayakingIcon from '@mui/icons-material/Kayaking';
import DeckIcon from '@mui/icons-material/Deck';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'; // Using hospital for first_camp to be generic
import HikingIcon from '@mui/icons-material/Hiking';
import ParkIcon from '@mui/icons-material/Park';
import NatureIcon from '@mui/icons-material/Nature';
import PoolIcon from '@mui/icons-material/Pool';
import ArtTrackIcon from '@mui/icons-material/ArtTrack';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import AccessibleIcon from '@mui/icons-material/Accessible';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; // A generic icon for historic site

// Mapping object for database fields to human-readable names and icons
const fieldMappings = {
  // Sports
  first_base: { name: 'Baseball', icon: SportsBaseballIcon },
  first_soft: { name: 'Softball', icon: SportsBaseballIcon },
  first_foot: { name: 'Football', icon: SportsFootballIcon },
  first_socc: { name: 'Soccer', icon: SportsSoccerIcon },
  first_rugb: { name: 'Rugby', icon: SportsRugbyIcon },
  first_bask: { name: 'Basketball', icon: SportsBasketballIcon },
  first_tenn: { name: 'Tennis', icon: SportsTennisIcon },
  first_voll: { name: 'Volleyball', icon: SportsVolleyballIcon },
  first_teth: { name: 'Tetherball', icon: HikingIcon },
  first_golf: { name: 'Golf', icon: EmojiEventsIcon },
  
  // Outdoor Activities
  first_hiki: { name: 'Hiking', icon: HikingIcon },
  first_jogg: { name: 'Jogging', icon: DirectionsWalkIcon },
  first_exer: { name: 'Exercise Fields', icon: FitnessCenterIcon },
  first_skat: { name: 'Skating', icon: RollerSkatingIcon },
  first_sk_1: { name: 'Skateboarding', icon: RollerSkatingIcon },
  first_outr: { name: 'Outrigger Canoe', icon: KayakingIcon },
  first_picn: { name: 'Picnicking', icon: DeckIcon },
  first_camp: { name: 'Camping (Tent)', icon: LocalHospitalIcon },
  first_ca_1: { name: 'Camping (Trailer)', icon: LocalHospitalIcon },
  first_chil: { name: 'Child Playground', icon: LocalHospitalIcon },
  first_swim: { name: 'Swimming', icon: PoolIcon },
  first_gymn: { name: 'Gymnastics', icon: FitnessCenterIcon },
  first_indo: { name: 'Indoor Rec', icon: ParkIcon },
  first_art_: { name: 'Art Work', icon: ArtTrackIcon },

  // Amenities and Features
  first_blea: { name: 'Bleachers', icon: ParkIcon },
  first_bus_: { name: 'Bus Stop', icon: DirectionsBusIcon },
  first_co_1: { name: 'Community Garden Plots', icon: NatureIcon },
  first_conc: { name: 'Concession', icon: ShoppingCartIcon },
  first_drin: { name: 'Drinking Water', icon: LocalDrinkIcon },
  first_ex_1: { name: 'Exercise Area', icon: FitnessCenterIcon },
  first_hand: { name: 'Handicap Access', icon: AccessibleIcon },
  first_ha_1: { name: 'Handicap Parking Stalls', icon: AccessibleIcon },
  first_hist: { name: 'Historic Site', icon: EmojiEventsIcon },
  first_land: { name: 'Landscape', icon: NatureIcon },
  first_life: { name: 'Lifeguard Towers', icon: LocationOnIcon },
  first_ligh: { name: 'Lights', icon: WbSunnyIcon },
  first_park: { name: 'Parking Stalls', icon: ParkIcon },
  first_pay_: { name: 'Pay Phone', icon: ParkIcon },
  first_pi_1: { name: 'Picnic Tables', icon: DeckIcon },
  first_rest: { name: 'Restroom', icon: LocalHospitalIcon },
  first_shad: { name: 'Shade Tree', icon: NatureIcon },
  first_show: { name: 'Shower', icon: LocalHospitalIcon },
  staffed: { name: 'Staffed', icon: LocalHospitalIcon }
};

/**
 * Maps database field names to human-readable names and Material UI icons.
 * @param {string} fieldName The database field name (e.g., 'first_base').
 * @returns {{name: string, icon: object}|null} An object with the display name and icon, or null if no mapping is found.
 */
export function getFieldDisplayName(fieldName) {
  return fieldMappings[fieldName] || null;
}

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

const MapUpdater = ({ pins }) => {
  const map = useMap();
  React.useEffect(() => {
    if (pins && pins.length > 0) {
      const latLngs = pins.map((pin) => [pin.lat, pin.lng]);
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, {
        padding: [50, 50],
        animate: true,
        duration: 0.5,
      });
    }
  }, [pins, map]);
  return null;
};

const Map = ({ center, zoom, parks }) => {
  const defaultCenter = center || [21.2865, -157.8225];
  const defaultZoom = zoom || 13;

  const pins = parks.map((park) => ({
    lat: park.first_lat,
    lng: park.first_long,
  }));

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      // Set scrollWheelZoom to true here
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater pins={pins} />
      {parks.map((park, index) => {
        const pin = pins[index];
        return (
          <Marker key={index} position={pin}>
            <Popup>
              <div>
                <h3>{park.park_name}</h3>
                <p>Address: {park.first_name} {park.first_city}, {park.first_zip}</p>
                <p>Size (sqft): {park.total_sqft}</p>
                <p>Features:</p>
                <ul>
                  {Object.keys(fieldMappings).map((field) => {
                    if (park[field] === 'T') {
                      const display = getFieldDisplayName(field);
                      return (
                        <li key={field}>
                          <display.icon style={{ verticalAlign: 'middle' }} /> {display.name}
                        </li>
                      );
                    }
                    return null;
                  })}
                </ul>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default Map;