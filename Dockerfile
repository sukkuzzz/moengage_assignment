# Single-stage Dockerfile that works with Railway
FROM node:20-alpine

# Install Python and build tools
RUN apk add --no-cache python3 py3-pip curl bash

WORKDIR /app

# Copy package files first for better caching
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

# Copy all frontend files
COPY frontend/ ./

# Build frontend
RUN npm run build

# Install Python dependencies
COPY backend/requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy backend
COPY backend/ ./
COPY sql_runner.db ./

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000 8000

# Start both services
CMD ["sh", "-c", "python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 & node server.js --port 3000 & wait"]
