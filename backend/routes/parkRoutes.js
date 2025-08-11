const express = require('express');
const { Park, AI } = require('../models'); // Import Sequelize models
const router = express.Router();
const { serializeParkForLLMProcessing, parksWithFeature } = require('../utils/mapUtils');
const { OpenAI } = require('openai'); // Import OpenAI client

// GET /api/items
router.get('/default', async (req, res) => {
  try {
    const parks = await Park.findAll();
    res.json(parks);
  } catch (err) {
    console.error('Error fetching parks:', err);
    res.status(500).json({ error: 'Failed to fetch parks.' });
  }
});


// @Todo: remove this for production
router.delete('/default', async (req, res) => {
  try {
    await Park.destroy({ where: {} }); // Deletes all parks
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting parks:', err);
    res.status(500).json({ error: 'Failed to delete parks.' });
  }
})

router.get('/ai/reset', async (req, res) => {
  try {
    const ai = await AI.findOne();
    if (!ai) {
      return res.status(404).json({ error: 'AI entry not found.' });
    }
    ai.parkIds = [];
    ai.chatContext = '';
    await ai.save();
  } catch (err) {
    console.error('Error resetting AI parks:', err);
    return res.status(500).json({ error: 'Failed to reset AI parks.' });
  } finally {
    res.redirect('/')
  }
});

router.get('/ai/test', async (req, res) => {
  const ai = await AI.findAll();
  res.json(ai);
});

router.get('/ai', async (req, res) => {
  try {
    const ai = await AI.findOne();
    if (!ai) {
      return res.status(404).json({ error: 'AI entry not found.' });
    }
    res.json({ parkObjectIds: ai.parkIds });
  } catch (err) {
    console.error('Error fetching AI parks:', err);
    res.status(500).json({ error: 'Failed to fetch AI parks.' });
  }
});

router.get('/ai/summary', async (req, res) => {
  try {
    const ai = await AI.findOne();
    if (!ai) {
      return res.status(404).json({ error: 'AI entry not found.' });
    }
    res.json({ currentSummary: ai.currentSummary });
  } catch (err) {
    console.error('Error fetching AI summary:', err);
    res.status(500).json({ error: 'Failed to fetch AI summary.' });
  }
});

router.post('/ai', async (req, res) => {

    const baseParks = await Park.findAll();
    const serializedBaseParks = baseParks.map(park => serializeParkForLLMProcessing(park));
    const currentParkIds = req.body.currentParkIds || [];
    const userCriteria = req.body.userCriteria || "All the parks with indoor rec";

    // Construct a prompr to the model. it will take the base parks, current Park IDs, and the user crideria.
    // The prompt should say to return a JSON array of park IDs that match the user criteria, and NOTHING ELSE.
    const prompt = `You are an expert in parks and recreation. Given the following parks data
    ${JSON.stringify(serializedBaseParks)}
    and the current park IDs ${JSON.stringify(currentParkIds)},
    please return a JSON array of park IDs that match the user criteria: "${userCriteria}"
    Do not return anything else, just the JSON array of park IDs.
    Some requests will be subtractive or additive to the current park IDs, so you may return an empty array if no parks match the criteria.
    `;
    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY, // Ensure you have your OpenAI API key set in your environment variables
    });

    const response = await client.responses.create({
        model: "gpt-5",
        input: prompt,
    });

    const response_text = response.output_text.trim();
    // parse as json array of numbers
    let parkIds;
    try {
        parkIds = JSON.parse(response_text);
    } catch (error) {
        console.error('Error parsing OpenAI response:', error);
        return res.status(500).json({ error: 'Failed to parse park data from OpenAI response' });
    }

    const parks = baseParks.filter(park => parkIds.includes(park.objectid));
    const testFeatureDisplayName = req.body.testFeatureDisplayName;
    parksWithFeature(parks, testFeatureDisplayName)
    const parkObjectIds = parks.map(park => park.objectid);

    // Save the current park IDs to the AI model
    let ai = await AI.findAll();
  
    if (ai.length !== 1) {
      console.error('AI entry not found or multiple entries exist.');
      res.status(404).json({ error: 'AI entry not found.' });
      return;
    }
    ai[0].parkIds = parkObjectIds;
    await ai[0].save();
    res.json({ parkObjectIds });

})

module.exports = router;