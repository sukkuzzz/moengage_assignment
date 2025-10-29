# Railway-compatible Dockerfile - flattens structure
FROM node:20-alpine

# Install Python and build tools
RUN apk add --no-cache python3 py3-pip curl bash

WORKDIR /app

# Copy and flatten frontend structure
COPY frontend/package.json ./
COPY frontend/package-lock.json ./
RUN npm install

# Copy all frontend files
COPY frontend/ ./

# Build frontend
RUN npm run build

# Copy backend files
COPY backend/requirements.txt ./
# Use a virtualenv to satisfy Alpine's PEP 668 managed environment
RUN python3 -m venv /app/venv
ENV PATH="/app/venv/bin:$PATH"
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./
COPY sql_runner.db ./

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000 8000

# Start both services
CMD ["sh", "-c", "python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 & node server.js --port 3000 & wait"]
