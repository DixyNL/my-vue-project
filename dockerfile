# Use an official Node.js runtime as a parent image
FROM node:lts-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./ 

# Install project dependencies
RUN npm install

# Copy project files and folders to the current working directory (i.e., 'app' folder)
COPY src ./src 

# Build app for production with minification
RUN npm run build

# Expose the port your app runs on
EXPOSE 8080

# Command to run your application
CMD ["npm", "run", "serve"]
