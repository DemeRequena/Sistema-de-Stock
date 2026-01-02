#!/usr/bin/env sh
set -e

# Wait for Postgres by trying to run prisma migrate until it succeeds
attempts=0
until npx prisma migrate deploy >/dev/null 2>&1; do
  attempts=$((attempts + 1))
  echo "Waiting for Postgres... attempt $attempts"
  if [ $attempts -gt 30 ]; then
    echo "Timeout waiting for database"
    exit 1
  fi
  sleep 2
done

# Generate Prisma client
npx prisma generate

# Seed admin user (defaults: admin@local / 123456)
export ADMIN_EMAIL=${ADMIN_EMAIL:-admin@local}
export ADMIN_PASS=${ADMIN_PASS:-123456}
# Run seed using environment variables so parsing is unnecessary
node prisma/seed.js || true

# Start the server (dev or prod)
if [ "$NODE_ENV" = "production" ]; then
  npm run start
else
  npm run start:dev
fi
