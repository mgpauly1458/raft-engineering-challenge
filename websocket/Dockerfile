# Use Node.js as the base image
FROM node:latest

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the WebSocket server code
COPY . .

# Expose the WebSocket server port
EXPOSE 8080

# Start the WebSocket server
CMD ["node", "websocketServer.js"]