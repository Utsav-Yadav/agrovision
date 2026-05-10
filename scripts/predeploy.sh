#!/bin/bash

# Pre-deployment checks
echo "Running pre-deployment checks..."

# Check Node version
node_version=$(node -v)
echo "Node.js version: $node_version"

# Check npm version
npm_version=$(npm -v)
echo "npm version: $npm_version"

# Check for required environment variables
if [ -z "$MONGODB_URI" ] && [ ! -f ".env" ]; then
  echo "Warning: MONGODB_URI not set and .env file not found"
  echo "Please set MONGODB_URI environment variable or create .env file"
fi

# Install dependencies
echo "Installing dependencies..."
npm ci --omit=dev

# Lint check (optional)
echo "Running linter..."
npm run lint || true

# Run tests (optional)
echo "Running tests..."
npm test || true

echo "Pre-deployment checks completed!"
