# Use lightweight Node image
FROM node:18-alpine
 
# Set working directory
WORKDIR /app
 
# Copy package.json and package-lock.json (if exists)
COPY package*.json ./
 
# Install dependencies
RUN npm install --production
 
# Copy the rest of the application
COPY . .
 
# Expose container port
EXPOSE 5000
 
# Start the app
CMD ["node", "app.js"]
