#!/bin/sh

# Process Nginx configuration templates
echo "Processing Nginx configuration templates..."
envsubst '$NGINX_PORT,$VIEWER_HOST,$VIEWER_PORT' < /etc/nginx/templates/proxy.conf > /etc/nginx/conf.d/proxy.conf

# Start Nginx
echo "Starting Nginx..."
exec "$@"
