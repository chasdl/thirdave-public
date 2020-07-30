#! /usr/bin/env bash
set -e

python /app/app/celeryworker_pre_start.py

echo "Starting celery cron..."
celery -A app.worker beat -l info & 
celery worker -A app.worker -l info -Q main-queue -c 1 &
tail -f /dev/null


