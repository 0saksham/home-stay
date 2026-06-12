#!/bin/bash
# Render build script — runs before start command
set -e   # exit on first error

echo "Installing dependencies..."
npm install

echo "Build complete."
