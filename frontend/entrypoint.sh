#!/bin/sh

# Replace placeholders in config.json
sed -i "s|__BACKEND_URL__|$BACKEND_URL|g" /usr/share/nginx/html/config.json

exec "$@"