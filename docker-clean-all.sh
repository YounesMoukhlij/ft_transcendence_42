#!/bin/bash

# Docker Complete Cleanup Script
# This script removes ALL Docker resources immediately

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "╔═══════════════════════════════════════╗"
echo "║   Docker Complete Cleanup Script      ║"
echo "╚═══════════════════════════════════════╝"
echo ""

echo -e "${YELLOW}⚠ WARNING: This will remove ALL Docker resources!${NC}"
echo ""

# Show current stats
echo -e "${BLUE}Current Docker Resources:${NC}"
echo "  Containers: $(docker ps -a -q 2>/dev/null | wc -l | tr -d ' ')"
echo "  Images: $(docker images -q 2>/dev/null | wc -l | tr -d ' ')"
echo "  Volumes: $(docker volume ls -q 2>/dev/null | wc -l | tr -d ' ')"
echo "  Networks: $(docker network ls -q 2>/dev/null | wc -l | tr -d ' ')"
echo ""

# Step 1: Stop all running containers
echo -e "${BLUE}[1/5]${NC} Stopping all running containers..."
if [ "$(docker ps -q)" ]; then
    docker stop $(docker ps -q) 2>/dev/null || true
    echo -e "${GREEN}✓${NC} Containers stopped"
else
    echo -e "${YELLOW}⚠${NC} No running containers"
fi

# Step 2: Remove all containers
echo -e "${BLUE}[2/5]${NC} Removing all containers..."
if [ "$(docker ps -a -q)" ]; then
    docker rm -f $(docker ps -a -q) 2>/dev/null || true
    echo -e "${GREEN}✓${NC} All containers removed"
else
    echo -e "${YELLOW}⚠${NC} No containers to remove"
fi

# Step 3: Remove all images
echo -e "${BLUE}[3/5]${NC} Removing all images..."
if [ "$(docker images -q)" ]; then
    docker rmi -f $(docker images -q) 2>/dev/null || true
    echo -e "${GREEN}✓${NC} All images removed"
else
    echo -e "${YELLOW}⚠${NC} No images to remove"
fi

# Step 4: Remove all volumes
echo -e "${BLUE}[4/5]${NC} Removing all volumes..."
if [ "$(docker volume ls -q)" ]; then
    docker volume rm -f $(docker volume ls -q) 2>/dev/null || true
    echo -e "${GREEN}✓${NC} All volumes removed"
else
    echo -e "${YELLOW}⚠${NC} No volumes to remove"
fi

# Step 5: Remove all custom networks
echo -e "${BLUE}[5/5]${NC} Removing all custom networks..."
docker network prune -f 2>/dev/null || true
echo -e "${GREEN}✓${NC} Custom networks removed"

# Final cleanup - system prune
echo ""
echo -e "${BLUE}Running final system prune...${NC}"
docker system prune -a -f --volumes 2>/dev/null || true

echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Complete cleanup finished!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""

# Show final stats
echo -e "${BLUE}Final Docker Resources:${NC}"
echo "  Containers: $(docker ps -a -q 2>/dev/null | wc -l | tr -d ' ')"
echo "  Images: $(docker images -q 2>/dev/null | wc -l | tr -d ' ')"
echo "  Volumes: $(docker volume ls -q 2>/dev/null | wc -l | tr -d ' ')"
echo "  Networks: $(docker network ls -q 2>/dev/null | wc -l | tr -d ' ')"
echo ""
