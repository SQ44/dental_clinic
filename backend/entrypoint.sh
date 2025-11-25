#!/bin/sh
set -e

echo "Running database seed..."
if npm run seed; then
  echo "Database seed completed."
else
  echo "Warning: database seed failed; continuing startup." >&2
fi

exec npm run start:prod
