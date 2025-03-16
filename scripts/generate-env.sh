#!/bin/bash

# Make sure the dist directory exists
mkdir -p /app/dist

# Create env-config.js with environment variables
echo "window.ENV_CONFIG = {" > /app/dist/env-config.js
echo "  SYNDICA_API_KEY: \"$VITE_SYNDICA_API_KEY\"," >> /app/dist/env-config.js
# Add other environment variables as needed
echo "};" >> /app/dist/env-config.js

echo "Environment variables exported to window.ENV_CONFIG"

# Execute the original command
exec "$@"