#!/bin/bash

# Docker Cleanup Script
# This script stops and removes all Docker containers, images, and volumes

set -e  # Exit on any error

echo "🐳 Starting Docker cleanup..."
echo "This will stop and remove ALL containers, images, and volumes!"
echo "Press Ctrl+C within 5 seconds to cancel..."
sleep 5

echo "⏹️  Stopping all running containers..."
docker stop $(docker ps -q) 2>/dev/null || echo "No running containers to stop"

echo "🗑️  Removing all containers..."
docker rm $(docker ps -aq) 2>/dev/null || echo "No containers to remove"

echo "🖼️  Removing all images..."
docker rmi $(docker images -q) 2>/dev/null || echo "No images to remove"

echo "💾 Removing all volumes..."
docker volume rm $(docker volume ls -q) 2>/dev/null || echo "No volumes to remove"

echo "🧹 Running system prune to clean up unused data..."
docker system prune -f

echo "✨ Docker cleanup completed!"
echo "📊 Current Docker status:"
docker ps -a
docker images
docker volume ls
