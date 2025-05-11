#!/bin/bash
# Super simple script to start Angular app with minimal configuration

# Force kill any existing ng serve processes
echo "Killing any existing ng serve processes..."
pkill -f "ng serve" || true

# Clear browser cache recommendation
echo "IMPORTANT: Clear your browser cache before testing!"

# Start Angular with minimal parameters
echo "Starting minimal Angular with only essential modules..."
cd /home/pers/GitHub/CoordinateAppUi
export NODE_OPTIONS=--max-old-space-size=4096
npm run start:basic