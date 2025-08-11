# Dockerfile

# Use an official Node.js runtime as the base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /usr/src/app/backend

# Copy package.json and package-lock.json and install dependencies
# This is done first to leverage Docker's caching
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
# This includes the server files and the `public` folder with the React build
COPY . .

# Expose the port the app runs on
# The Express server will be listening on this port inside the container
EXPOSE 8080

# Define the command to run the application
# We'll use the PORT environment variable to tell Express which port to listen on
CMD [ "node", "server.js" ]