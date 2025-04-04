FROM node:18-alpine

# Create an app directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Build the production-ready app
RUN npm run build

# Expose Next.js on port 3000
EXPOSE 3000

# Start the server
CMD ["npm", "start"]