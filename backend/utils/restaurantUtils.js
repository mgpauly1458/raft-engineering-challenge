const { OpenAI } = require('openai'); // Import OpenAI client

const getRestaurantList = async (destinationCity, foodPreferences, budget, numberOfResturaunts) => {
    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY, // Ensure you have your OpenAI API key set in your environment variables
    });

const response = await client.responses.create({
    model: "gpt-4.1",
    input: `You are a helpful assistant that provides restaurant recommendations based on user preferences.
    User's preferences:
    - Destination City: ${destinationCity}
    - Food Preferences: ${foodPreferences}
    - Budget: ${budget}
    - Number of Restaurants: ${numberOfResturaunts || 5}
    Provide a list of recommended restaurants with their names, addresses, descriptions, budget levels, and geographical coordinates (latitude and longitude). Keep the descriptions descriptive but prompt, don't exceed 200 characters. Format the response as a JSON array of objects, each containing the following fields:
    - name: string
    - address: string
    - description: string
    - budget: string (e.g., '$', '$$', '$$$')
    - latitude: float
    - longitude: float`,
});

 // Parse the response to extract json list of restaurants
    try {
        const restaurants = JSON.parse(response.output_text);
        return restaurants;
    } catch (error) {
        console.error('Error parsing OpenAI response:', error);
        throw new Error('Failed to parse restaurant data from OpenAI response');
    }
};



module.exports = { getRestaurantList };