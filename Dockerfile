# base image
FROM node:11.14.0 as react-build

# Set working directory
WORKDIR /app

# Install and cache app dependencies
COPY . ./

# Change to the ui directory
WORKDIR ./ui

# Install the application
RUN npm install

# Build the app for production
RUN npm run build

# Change to the server directory
WORKDIR ../server

# Build the server
RUN npm install

CMD ["npm", "start"]
