#!/bin/bash

# Casino - Quick Start Setup Script
# This script sets up the casino platform for local development

set -e

echo "🎰 Casino - Quick Start Setup"
echo "================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "${BLUE}Checking Node.js installation...${NC}"
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node --version) detected${NC}"

# Setup Backend
echo -e "\n${BLUE}Setting up Backend...${NC}"
cd backend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

# Setup Frontend
echo -e "\n${BLUE}Setting up Frontend...${NC}"
cd ../frontend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"

echo -e "\n${BLUE}To start development:${NC}"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend && npm run dev"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend && npm run dev"
echo ""
echo "Then open: http://localhost:5173"
echo ""
echo "Demo credentials:"
echo "  Username: demo"
echo "  Password: demo123"
echo ""
