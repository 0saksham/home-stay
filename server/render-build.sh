#!/bin/bash
# Render build script — runs before start command
set -e   # exit on first error

echo "Installing dependencies..."
npm install

echo "Rebuilding better-sqlite3 for the deploy platform..."
npm rebuild better-sqlite3 --build-from-source

echo "Build complete."
