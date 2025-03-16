#!/bin/bash

# Make sure the public folder exists
mkdir -p /app/dist

# Create env-config.js with all environment variables
echo "// This file is auto-generated" > /app/dist/env-config.js
echo "window.ENV_CONFIG = {" >> /app/dist/env-config.js
echo "  SYNDICA_API_KEY: \"$VITE_SYNDICA_API_KEY\"," >> /app/dist/env-config.js
echo "  FIREBASE_API_KEY: \"$FIREBASE_API_KEY\"," >> /app/dist/env-config.js
echo "  FIREBASE_AUTH_DOMAIN: \"$FIREBASE_AUTH_DOMAIN\"," >> /app/dist/env-config.js
echo "};" >> /app/dist/env-config.js

# Execute the original command (start the server)
exec "$@"