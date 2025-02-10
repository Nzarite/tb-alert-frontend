# Use a Node.js image that supports structuredClone
FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Expose the port for the dev server
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev", "--", "--host"]
