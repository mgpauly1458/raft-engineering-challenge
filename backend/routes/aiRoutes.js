const express = require('express');
const { AI } = require('../models'); // Import Sequelize models
const router = express.Router();

// There should only be one AI entry in the database
router.get('/', async (req, res) => {
    try {
        const aiEntry = await AI.findOne();
        if (!aiEntry) {
            return res.status(404).json({ error: 'AI entry not found.' });
        }
        res.json(aiEntry);
    } catch (error) {
        console.error('Error fetching AI entry:', error);
        res.status(500).json({ error: 'Failed to fetch AI entry.' });
    }
})

router.post('/context', async (req, res) => {
    const { chatContext } = req.body;
    if (!chatContext) {
        return res.status(400).json({ error: 'Conversation context is required.' });
    }

    try {
        const aiEntry = await AI.findOne();
        if (!aiEntry) {
            return res.status(404).json({ error: 'AI entry not found.' });
        }
        aiEntry.chatContext = chatContext;
        await aiEntry.save();
        res.json({ message: 'Chat context updated successfully.' });
    } catch (error) {
        console.error('Error updating AI entry:', error);
        res.status(500).json({ error: 'Failed to update AI entry.' });
    }
});

module.exports = router;