#!/bin/bash

# FinArth Backend Startup Script
echo "Starting FinArth Backend Services..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python3 is not installed. Please install Python3 first."
    exit 1
fi

# Install Python dependencies
echo "Installing Python dependencies..."
cd src
pip3 install -r requirements.txt