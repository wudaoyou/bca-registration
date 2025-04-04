#!/usr/bin/env bash
set -e

echo "Building Docker images..."
docker compose build

echo "Pruning unused Docker images..."
docker image prune -f

echo "Starting containers..."
docker compose up -d
