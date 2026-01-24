#!/bin/bash

# Docker Cleanup Script
# This script helps clean up Docker images, volumes, containers, and networks

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Function to show Docker stats
show_docker_stats() {
    echo ""
    print_info "Current Docker Resources:"
    echo "  Containers: $(docker ps -a -q | wc -l | tr -d ' ')"
    echo "  Images: $(docker images -q | wc -l | tr -d ' ')"
    echo "  Volumes: $(docker volume ls -q | wc -l | tr -d ' ')"
    echo "  Networks: $(docker network ls -q | wc -l | tr -d ' ')"
    echo ""
}

# Function to confirm action
confirm() {
    read -p "$(echo -e ${YELLOW}$1${NC}) [y/N] " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        return 0
    else
        return 1
    fi
}

# Display banner
echo ""
echo "╔═══════════════════════════════════════╗"
echo "║     Docker Cleanup Script             ║"
echo "╔═══════════════════════════════════════╝"
echo ""

# Show current stats
show_docker_stats

# Main menu
echo "Select cleanup option:"
echo "  1) Stop and remove all containers"
echo "  2) Remove all images"
echo "  3) Remove all volumes"
echo "  4) Remove all networks (except default ones)"
echo "  5) Complete cleanup (all of the above)"
echo "  6) Prune unused resources (safe cleanup)"
echo "  7) Exit"
echo ""
read -p "Enter your choice [1-7]: " choice

case $choice in
    1)
        print_info "Stopping and removing all containers..."
        if [ "$(docker ps -a -q)" ]; then
            docker stop $(docker ps -a -q) 2>/dev/null || true
            docker rm $(docker ps -a -q) 2>/dev/null || true
            print_success "All containers removed"
        else
            print_warning "No containers to remove"
        fi
        ;;
    
    2)
        print_info "Removing all Docker images..."
        if [ "$(docker images -q)" ]; then
            if confirm "This will remove ALL Docker images. Continue?"; then
                docker rmi $(docker images -q) -f 2>/dev/null || true
                print_success "All images removed"
            else
                print_warning "Operation cancelled"
            fi
        else
            print_warning "No images to remove"
        fi
        ;;
    
    3)
        print_info "Removing all Docker volumes..."
        if [ "$(docker volume ls -q)" ]; then
            if confirm "This will remove ALL Docker volumes (including data). Continue?"; then
                docker volume rm $(docker volume ls -q) -f 2>/dev/null || true
                print_success "All volumes removed"
            else
                print_warning "Operation cancelled"
            fi
        else
            print_warning "No volumes to remove"
        fi
        ;;
    
    4)
        print_info "Removing custom Docker networks..."
        if confirm "Remove all custom networks?"; then
            docker network prune -f
            print_success "Custom networks removed"
        else
            print_warning "Operation cancelled"
        fi
        ;;
    
    5)
        print_warning "COMPLETE CLEANUP - This will remove:"
        echo "  • All containers"
        echo "  • All images"
        echo "  • All volumes"
        echo "  • All custom networks"
        echo ""
        if confirm "Are you absolutely sure?"; then
            # Stop and remove containers
            print_info "Stopping containers..."
            docker stop $(docker ps -a -q) 2>/dev/null || true
            
            print_info "Removing containers..."
            docker rm $(docker ps -a -q) 2>/dev/null || true
            
            print_info "Removing images..."
            docker rmi $(docker images -q) -f 2>/dev/null || true
            
            print_info "Removing volumes..."
            docker volume rm $(docker volume ls -q) -f 2>/dev/null || true
            
            print_info "Removing networks..."
            docker network prune -f 2>/dev/null || true
            
            print_success "Complete cleanup finished!"
        else
            print_warning "Operation cancelled"
        fi
        ;;
    
    6)
        print_info "Pruning unused Docker resources (safe cleanup)..."
        echo ""
        docker system prune -a --volumes -f
        print_success "Pruning completed!"
        ;;
    
    7)
        print_info "Exiting..."
        exit 0
        ;;
    
    *)
        print_error "Invalid option"
        exit 1
        ;;
esac

# Show final stats
show_docker_stats

print_success "Cleanup completed!"
echo ""
