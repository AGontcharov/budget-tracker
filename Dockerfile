# base image
FROM node:11.14.0 as react-build

# Set working directory
WORKDIR /app

# Install and cache app dependencies
COPY . ./

# Change to the ui directory
WORKDIR ./ui

# Build the application
RUN npm run build

# Change to the server directory
WORKDIR ../server

# Build the server
RUN npm install

CMD ["npm", "start"]
