const parksData = require('./data/parksData.json');
const { serializeParkForLLMProcessing } = require('./utils/mapUtils'); // Import utility function to serialize parks

const serializedParks = parksData.map(park => serializeParkForLLMProcessing(park));
console.log('Serialized Parks:', serializedParks);
// Log the park with objectid 3
console.log('Serialized Park with objectid 3:', serializedParks.find(park => park.objectId === 3));