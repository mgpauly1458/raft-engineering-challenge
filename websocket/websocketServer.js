require('dotenv').config();
const WebSocket = require('ws');
const { OpenAI } = require('openai'); // Import OpenAI client
// OpenAI API setup
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create WebSocket server
const wss = new WebSocket.Server({ port: process.env.WS_PORT });

wss.on('connection', (ws) => {

  ws.on('message', async (message) => {

    const parsedMessage = JSON.parse(message);
    const { newUserQuery, serializedParks, chatContextHistory } = parsedMessage.message;
    const prompt = `You are a helpful assistant that provides information about parks based on user queries.
    User's query: ${newUserQuery}
    Parks data: ${serializedParks}
    Chat context history: ${chatContextHistory}
    Provide a concise and informative response based on the user's query and the parks data.
    The response should be short and to the point, no more than 100-200 characters.
    Your job is to summarize the parks data based on the user's query and provide relevant information.
    The chat history is included in case it helps you understand the context of the user's query.`

    try {
      // Call OpenAI's API with streaming enabled
      const stream = await client.chat.completions.create({
        model: "gpt-4.1", // Use the correct model
        messages: [
          {
            role: "user",
            content: prompt, // Use the prompt based on the type
          },
        ],
        stream: true, // Enable streaming
      });

      // Stream the response to the client
      for await (const event of stream) {
        if (event.choices && event.choices[0].delta && event.choices[0].delta.content) {
          ws.send(event.choices[0].delta.content); // Send the streamed content to the client
        }
      }

      ws.close();
      // Notify the client that the stream is complete
    } catch (error) {
      console.error('Error with OpenAI API:', error);
      ws.send('Error: Unable to process the request.');
    }
  });
  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
  });
});

console.log(`WebSocket server is running on port ${process.env.WS_PORT}`);