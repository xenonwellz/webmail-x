#!/bin/sh

# Wait for the database to be ready
echo "Waiting for database to be ready..."
while ! nc -z $DATABASE_HOST $DATABASE_PORT; do
  sleep 1
done
echo "Database is ready!"

# Run migrations
echo "Running database migrations..."
node /app/packages/backend/ace migration:run --force
echo "Migrations completed!"

# Start the application
echo "Starting the application..."
exec "$@"
