#!/usr/bin/env bash
set -euo pipefail

# PURPOSE
#   Rewrite git history to remove leaked secrets and redact a known key.
#   This will change commit SHAs and may drop empty commits. You WILL force-push.
#   Coordinate with collaborators before proceeding.
#
# REQUIREMENTS
#   - Run from the repo root: ./scripts/purge_secrets.sh
#   - Python + git-filter-repo installed: https://github.com/newren/git-filter-repo
#     On Linux:
#       pip install git-filter-repo
#
# WHAT THIS DOES
#   - Removes paths: backend/.env, backend/.env.production from ALL history
#   - Replaces exposed Resend key string with placeholder everywhere
#   - Runs garbage collection and pushes instructions

REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT"

if ! command -v git-filter-repo >/dev/null 2>&1; then
  echo "git-filter-repo not found. Install it first, e.g.:"
  echo "  pip install git-filter-repo"
  exit 1
fi

# Safety check: ensure working tree is clean
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Please commit or stash your changes before running the purge."
  exit 1
fi

# Create a backup in case you need to recover
BACKUP_REF="backup/pre-purge-$(date +%Y%m%d-%H%M%S)"
git branch "$BACKUP_REF"
echo "Created backup branch: $BACKUP_REF"

# Generate replace-text file for sensitive tokens
REPLACE_FILE=$(mktemp)
cat > "$REPLACE_FILE" << 'EOF'
RESEND_API_KEY_REDACTED==>RESEND_API_KEY_REDACTED
EOF

echo "Running git-filter-repo to remove files and redact tokens..."
# Remove specific secret files from history
git filter-repo \
  --force \
  --path backend/.env --path backend/.env.production --invert-paths

# Redact the known leaked key string across the repo history
git filter-repo \
  --force \
  --replace-text "$REPLACE_FILE"

rm -f "$REPLACE_FILE"

echo "\nPurge complete. Next steps:"
echo "  1) Review the rewritten history locally (git log, diff, etc)."
echo "  2) Force push all refs to origin (this rewrites remote history):"
echo "     git push --force --all"
echo "     git push --force --tags"
echo "  3) Ask all collaborators to re-clone or hard reset to the new history."
echo "  4) Rotate the exposed keys (Resend, etc.) if not already done."
