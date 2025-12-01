#!/bin/bash

# Fix Next.js chunk loading error by clearing cache and restarting

echo "🧹 Clearing Next.js cache..."
rm -rf .next
rm -rf node_modules/.cache

echo "✅ Cache cleared!"
echo ""
echo "📝 Next steps:"
echo "1. Stop your Next.js dev server (Ctrl+C)"
echo "2. Run: npm run dev (or your dev command)"
echo "3. The error should be resolved!"

