#!/bin/bash
# Exit code 1 = build needed
# Exit code 0 = skip build

# Environment variables Vercel provides:
# VERCEL_GIT_COMMIT_REF → the branch being pushed
# $VERCEL_GIT_PULL_REQUEST_ID → if a the pull request ID exists, a preview build is triggered 

PRODUCTION_BRANCH="main"

if [[ "$VERCEL_ENV" == "production" && "$VERCEL_GIT_COMMIT_REF" == "$PRODUCTION_BRANCH" ]]; then
  exit 1 
fi

if [[ "$VERCEL_ENV" == "preview" && -n "$VERCEL_GIT_PULL_REQUEST_ID" ]]; then
  exit 1 
fi

exit 0