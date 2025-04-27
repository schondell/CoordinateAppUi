#!/bin/bash
# Simple script to start Angular app for debugging

# Force kill any existing ng serve processes
echo "Killing any existing ng serve processes..."
pkill -f "ng serve" || true

# Clear browser cache recommendation
echo "IMPORTANT: Clear your browser cache before testing!"

# Start Angular with minimal parameters
echo "Starting Angular app with basic configuration..."
cd /home/pers/GitHub/CoordinateAppUi
npm run start:basic