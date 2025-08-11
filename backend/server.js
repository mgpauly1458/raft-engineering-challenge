require('dotenv').config();

const express = require('express');
const path = require('path');
const parkRoutes = require('./routes/parkRoutes');
const aiRoutes = require('./routes/aiRoutes');

const { sequelize, Park, AI } = require('./models'); // Import Sequelize models
const app = express();
const PORT = process.env.PORT || 5000;
const parksData = require('./data/parksData.json'); // Import parks data

console.log(`Server starting in env: ${process.env.APP_ENV}`)

////////////////////////////////////////////// Database Setup //////////////////////////////////////////

async function initializeDb() {
  try {
    await sequelize.authenticate();
    console.log('Connection to PostgreSQL has been established successfully.');
    await Park.sync({ alter: true });
    console.log('Park table created or already exists.');
    await AI.sync({ alter: true });
    console.log('AI table created or already exists.');

    // Check if the parks table is empty and insert default data if it is
    const parksCount = await Park.count();
    if (parksCount === 0) {
      // get first 100 parks
      const first50Parks = parksData.slice(0, 50);
      console.log('Inserting default parks data...');
      await Park.bulkCreate(first50Parks);
      // await Park.bulkCreate(parksData);
      console.log('Default parks data inserted successfully.');
    }

    const aiCount = await AI.count();
    if (aiCount === 0) {
      console.log('Creating default AI entry...');
      await AI.create({
        currentSummary: '',
        currentParkIds: [],
      });
      console.log('Default AI entry created successfully.');
    }

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
initializeDb();

///////////////////////////////////////////// Middleware //////////////////////////////////////////
// --- Serve the React frontend from the 'public' directory ---
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

///////////////////////////////////////////// Routes //////////////////////////////////////////
app.use('/api/parks', parkRoutes)
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

///////////////////////// Start the server and listen on the specified port /////////////////////////
app.listen(PORT, () => {
  console.log(`Message from .env: ${process.env.MESSAGE}`);
  console.log(`Server is running and serving the React app on port ${PORT}`);
});
