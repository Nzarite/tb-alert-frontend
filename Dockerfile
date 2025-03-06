# Use a Node.js image that supports structuredClone
FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./

# Expose the port for the dev server
EXPOSE 5173

# Copy the rest of the project files except ignored ones in .dockerignore
COPY . .

# Set entrypoint to install dependencies and start the dev server
CMD ["sh", "-c", "npm install && npm run dev -- --host"]
