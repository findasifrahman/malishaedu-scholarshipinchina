#!/bin/bash

# MalishaEdu Global Scholarship Platform Setup Script
echo "🚀 Setting up MalishaEdu Global Scholarship Platform..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi

print_status "npm version: $(npm -v)"

# Install root dependencies
print_info "Installing root dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_status "Root dependencies installed successfully"
else
    print_error "Failed to install root dependencies"
    exit 1
fi

# Install backend dependencies
print_info "Installing backend dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    print_status "Backend dependencies installed successfully"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi

# Install frontend dependencies
print_info "Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -eq 0 ]; then
    print_status "Frontend dependencies installed successfully"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

cd ..

# Check if Docker is installed (optional)
if command -v docker &> /dev/null; then
    print_status "Docker is available"
    if command -v docker-compose &> /dev/null; then
        print_status "Docker Compose is available"
    else
        print_warning "Docker Compose is not installed. You can still run the project without Docker."
    fi
else
    print_warning "Docker is not installed. You can still run the project without Docker."
fi

# Create environment files if they don't exist
print_info "Setting up environment files..."

if [ ! -f backend/.env ]; then
    cp backend/env.example backend/.env
    print_status "Created backend/.env from template"
    print_warning "Please update backend/.env with your actual configuration values"
else
    print_status "backend/.env already exists"
fi

if [ ! -f frontend/.env ]; then
    cat > frontend/.env << EOF
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=MalishaEdu Global Scholarship Platform
VITE_APP_VERSION=1.0.0
EOF
    print_status "Created frontend/.env"
else
    print_status "frontend/.env already exists"
fi

# Create necessary directories
print_info "Creating necessary directories..."
mkdir -p backend/uploads
mkdir -p frontend/public/images
print_status "Directories created"

# Database setup instructions
print_info "Database Setup Instructions:"
echo ""
echo "1. Install PostgreSQL 15 or higher"
echo "2. Create a database named 'malisha_edu_db'"
echo "3. Update the database connection details in backend/.env"
echo "4. Run the following commands to set up the database:"
echo "   cd backend"
echo "   npm run migrate"
echo "   npm run seed"
echo ""

# Development setup instructions
print_info "Development Setup Instructions:"
echo ""
echo "To start the development servers:"
echo "1. Start the backend: cd backend && npm run dev"
echo "2. Start the frontend: cd frontend && npm run dev"
echo "3. Or use the root command: npm run dev"
echo ""

# Docker setup instructions
if command -v docker &> /dev/null; then
    print_info "Docker Setup Instructions:"
    echo ""
    echo "To run with Docker:"
    echo "1. Development: docker-compose -f docker-compose.dev.yml up"
    echo "2. Production: docker-compose up"
    echo ""
fi

# Deployment instructions
print_info "Deployment Instructions:"
echo ""
echo "For Railway deployment:"
echo "1. Install Railway CLI: npm install -g @railway/cli"
echo "2. Login to Railway: railway login"
echo "3. Deploy: railway up"
echo ""

# Final success message
print_status "Setup completed successfully! 🎉"
echo ""
echo "Next steps:"
echo "1. Set up your PostgreSQL database"
echo "2. Update environment variables in backend/.env"
echo "3. Run database migrations and seeds"
echo "4. Start the development servers"
echo ""
echo "For more information, check the README.md file."
echo ""
print_info "Happy coding! 🚀"
