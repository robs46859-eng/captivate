#!/bin/bash
cd "$(dirname "$0")"

echo "================================================"
echo "  NanoStudio → GitHub Push (captivate repo)"
echo "================================================"
echo ""

# Remove stale locks
rm -f .git/index.lock 2>/dev/null

# Check gh CLI
if command -v gh &> /dev/null; then
  echo "✓ GitHub CLI found"
  gh auth status 2>/dev/null || gh auth login
fi

# Init git if needed
if [ ! -d ".git" ]; then
  git init
  git branch -M main
fi

git checkout -B main 2>/dev/null || true

# Set remote to captivate repo
git remote remove origin 2>/dev/null
git remote add origin https://github.com/robs46859-eng/captivate.git

# Configure identity
git config user.email "robs46859@gmail.com"
git config user.name "Robert Smith"

# Stage and commit
git add -A
echo ""
echo "Staged files:"
git status --short

echo ""
echo "Committing NanoStudio build..."
git commit -m "feat: NanoStudio — React/Node cockpit, AI workflow, clearer landing page messaging" 2>&1

echo ""
echo "Pushing to main branch..."
git push -u origin main --force
RESULT=$?

echo ""
if [ $RESULT -eq 0 ]; then
  echo "✅ Pushed to github.com/robs46859-eng/captivate"
  echo ""
  echo "NOTE: This repo uses GitHub Pages. To deploy the React app,"
  echo "you'll need App Runner (like StelarBIM)."
  echo "Use the deploy-aws.command file to set that up."
else
  echo "⚠️  Push failed — check credentials"
fi

echo ""
read -p "Press Enter to close..."
