#!/bin/bash
set -e

echo "=========================================="
echo "🚀 Deploying efChamps on Oracle Cloud VPS"
echo "=========================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker and Docker Compose..."
    sudo apt update
    sudo apt install -y docker.io docker-compose git
    sudo systemctl enable --now docker
    sudo usermod -aG docker "$USER"
    echo "Docker installed successfully!"
fi

# Open Ubuntu iptables ports 80 & 443
echo "🛡️ Configuring Ubuntu internal firewall rules for ports 80 and 443..."
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT || true
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT || true

# Build and start all services
echo "🔨 Building and launching containers (Postgres, NestJS, Next.js, Nginx)..."
docker-compose down || true
docker-compose up -d --build

echo "=========================================="
echo "✅ efChamps is now live on your VPS!"
echo "Visit: http://$(curl -s ifconfig.me)"
echo "=========================================="
