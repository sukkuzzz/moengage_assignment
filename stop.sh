#!/bin/bash

# SQL Runner Stop Script

echo "🛑 Stopping SQL Runner Application..."

# Stop and remove containers
docker-compose down

echo "✅ SQL Runner has been stopped!"
echo ""
echo "To start again, run: ./start.sh"
echo "To remove all data, run: docker-compose down -v"
