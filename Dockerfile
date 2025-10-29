# Multi-stage Dockerfile for Railway deployment
FROM node:20-alpine AS frontend-build

# Build frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --frozen-lockfile=false
COPY frontend/ ./
RUN npm run build

# Production stage
FROM python:3.11-slim

# Install Node.js
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend
COPY backend/ ./
COPY sql_runner.db ./

# Copy frontend build
COPY --from=frontend-build /app/frontend/.next/standalone ./
COPY --from=frontend-build /app/frontend/.next/static ./.next/static
COPY --from=frontend-build /app/frontend/public ./public

# Environment
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000 8000

# Start both services
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port 8000 & node server.js --port 3000 & wait"]
