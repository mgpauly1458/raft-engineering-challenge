const { OpenAI } = require('openai'); // Import OpenAI client

const mapDisplayNamesToFieldNames = {
  // Sports
  Baseball: 'first_base',
  Softball: 'first_soft',
  Football: 'first_foot',
  Soccer: 'first_socc',
  Rugby: 'first_rugb',
  Basketball: 'first_bask',
  Tennis: 'first_tenn',
  Volleyball: 'first_voll',
  Tetherball: 'first_teth',
  Golf: 'first_golf',
    // Outdoor Activities
    Hiking: 'first_hiki',
    Jogging: 'first_jogg',
    ExerciseFields: 'first_exer',
    Skating: 'first_skat',
    Skateboarding: 'first_sk_1',
    OutriggerCanoe: 'first_outr',
    Picnicking: 'first_picn',
    CampingTent: 'first_camp',
    CampingTrailer: 'first_ca_1',
    ChildPlayground: 'first_chil',
    Swimming: 'first_swim',
    Gymnastics: 'first_gymn',
    IndoorRec: 'first_indo',
    ArtWork: 'first_art_',
    // Amenities and Features
    Bleacher: 'first_blea',
    BusStop: 'first_bus_',
    CommunityGardenPlots: 'first_co_1',
    Concession: 'first_conc',
    DrinkingWater: 'first_drin',
    ExerciseArea: 'first_ex_1',
    HandicapAccess: 'first_hand',
    HandicapParkingStalls: 'first_ha_1',
    HistoricSite: 'first_hist',
    Landscape: 'first_land',
    LifeguardTowers: 'first_life',
    Lights: 'first_ligh',
    ParkingStalls: 'first_park',
    PayPhone: 'first_pay_',
    PicnicTables: 'first_pi_1',
    Restroom: 'first_rest',
    ShadeTree: 'first_shad',
    Shower: 'first_show',
    Staffed: 'staffed',
};

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

const parksWithFeature = (parkList, featureDisplayName) => {
    const featureFieldName = mapDisplayNamesToFieldNames[featureDisplayName];
    const parks = parkList.filter(park => park[featureFieldName] === 'T');
    for (const park of parks) {
        console.log(`- ${park.first_name} (${park.objectid})`);
    }
}

const serializeParkForLLMProcessing = (park) => {
    return {
        objectId: park.objectid,
        name: park.park_name,
        address: `${park.first_name} ${park.first_city}, ${park.first_zip}`,
        features: getFeaturesOfPark(park),
    }
}

// const getRestaurantList = async (destinationCity, foodPreferences, budget, numberOfResturaunts) => {
//     const client = new OpenAI({
//         apiKey: process.env.OPENAI_API_KEY, // Ensure you have your OpenAI API key set in your environment variables
//     });

// const response = await client.responses.create({
//     model: "gpt-4.1",
//     input: `You are a helpful assistant that provides restaurant recommendations based on user preferences.
//     User's preferences:
//     - Destination City: ${destinationCity}
//     - Food Preferences: ${foodPreferences}
//     - Budget: ${budget}
//     - Number of Restaurants: ${numberOfResturaunts || 5}
//     Provide a list of recommended restaurants with their names, addresses, descriptions, budget levels, and geographical coordinates (latitude and longitude). Keep the descriptions descriptive but prompt, don't exceed 200 characters. Format the response as a JSON array of objects, each containing the following fields:
//     - name: string
//     - address: string
//     - description: string
//     - budget: string (e.g., '$', '$$', '$$$')
//     - latitude: float
//     - longitude: float`,
// });

// console.log(response.output_text);
//  // Parse the response to extract json list of restaurants
//     try {
//         const restaurants = JSON.parse(response.output_text);
//         return restaurants;
//     } catch (error) {
//         console.error('Error parsing OpenAI response:', error);
//         throw new Error('Failed to parse restaurant data from OpenAI response');
//     }
// };



module.exports = { serializeParkForLLMProcessing, parksWithFeature };