#!/bin/bash
# Installs npm dependencies so typecheck/build work in Claude Code cloud sessions.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# npm install (not ci) so the cached container keeps node_modules between sessions.
npm install --no-audit --no-fund
