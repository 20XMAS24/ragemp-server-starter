#!/bin/bash

echo "========================================"
echo "RAGE MP Server Deployment Script"
echo "========================================"
echo ""

# Check if server path is provided
if [ -z "$1" ]; then
    echo "Usage: ./deploy.sh /path/to/your/ragemp/server"
    echo "Example: ./deploy.sh /home/user/ragemp-server"
    exit 1
fi

SERVER_PATH="$1"
echo "Server path: $SERVER_PATH"
echo ""

echo "[1/5] Building TypeScript..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: Build failed!"
    exit 1
fi
echo "Build complete!"
echo ""

echo "[2/5] Creating directories..."
mkdir -p "$SERVER_PATH/packages/gamemode"
mkdir -p "$SERVER_PATH/dist"
mkdir -p "$SERVER_PATH/database"
echo "Directories created!"
echo ""

echo "[3/5] Copying packages..."
cp -r packages/gamemode/* "$SERVER_PATH/packages/gamemode/"
echo "Packages copied!"
echo ""

echo "[4/5] Copying compiled code..."
cp -r dist/* "$SERVER_PATH/dist/"
echo "Compiled code copied!"
echo ""

echo "[5/5] Copying node_modules..."
if [ ! -d "$SERVER_PATH/node_modules" ]; then
    cp -r node_modules "$SERVER_PATH/"
    echo "Node modules copied!"
else
    echo "Node modules already exist, skipping..."
fi
echo ""

echo "========================================"
echo "Deployment complete!"
echo "========================================"
echo ""
echo "Your server is ready to start!"
echo "Run: cd $SERVER_PATH && ./ragemp-server"
echo ""
