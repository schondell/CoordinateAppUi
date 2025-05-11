#!/bin/bash
# Script to start Angular with minimal configuration and direct output

echo "Starting Angular app directly..."
npx ng serve --port=44450 --configuration=development --browser=src/minimal-main.ts