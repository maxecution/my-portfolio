#!/bin/bash
# Exit code 1 = build needed
# Exit code 0 = skip build

# Environment variables Vercel provides:
# VERCEL_GIT_COMMIT_REF → the branch being pushed
# $VERCEL_GIT_PULL_REQUEST_ID → if a the pull request ID exists, a preview build is triggered 

echo "Initial check - waiting for Vercel env vars..."
echo "VERCEL_ENV (before sleep)=$VERCEL_ENV"
echo "VERCEL_GIT_PULL_REQUEST_ID (before sleep)=$VERCEL_GIT_PULL_REQUEST_ID"
echo "VERCEL_GIT_COMMIT_REF (before sleep)=$VERCEL_GIT_COMMIT_REF"

sleep 10 # wait longer for Vercel env vars to be available

echo "After sleep - checking env vars again..."
PRODUCTION_BRANCH="main"

# Polling mechanism to wait for environment variables
echo "Waiting for environment variables to be set..."
for i in {1..5}; do
    echo "Attempt $i/5:"
    echo "VERCEL_ENV=$VERCEL_ENV"
    echo "VERCEL_GIT_PULL_REQUEST_ID=$VERCEL_GIT_PULL_REQUEST_ID"
    echo "VERCEL_GIT_COMMIT_REF=$VERCEL_GIT_COMMIT_REF"
    
    # If we have the required env vars, break out of loop
    if [[ -n "$VERCEL_ENV" && -n "$VERCEL_GIT_COMMIT_REF" ]]; then
        echo "Environment variables are available!"
        break
    fi
    
    if [[ $i -lt 5 ]]; then
        echo "Waiting 2 more seconds..."
        sleep 2
    fi
done

done

echo "=== FINAL DECISION LOGIC ==="
echo "VERCEL_ENV=$VERCEL_ENV"
echo "VERCEL_GIT_PULL_REQUEST_ID=$VERCEL_GIT_PULL_REQUEST_ID" 
echo "VERCEL_GIT_COMMIT_REF=$VERCEL_GIT_COMMIT_REF"
echo "PRODUCTION_BRANCH=$PRODUCTION_BRANCH"

if [[ "$VERCEL_ENV" == "production" && "$VERCEL_GIT_COMMIT_REF" == "$PRODUCTION_BRANCH" ]]; then
  echo "Production build on main branch - BUILDING"
  exit 1 
fi

if [[ "$VERCEL_ENV" == "preview" && -n "$VERCEL_GIT_PULL_REQUEST_ID" ]]; then
  echo "Preview build with PR ID - BUILDING"
  exit 1 
fi

echo "Conditions not met - SKIPPING BUILD"
exit 0