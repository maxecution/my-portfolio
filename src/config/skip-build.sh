#!/bin/bash
# Exit code 1 = build needed
# Exit code 0 = skip build

# Environment variables Vercel provides:
# VERCEL_GIT_COMMIT_REF → the branch being pushed
# $VERCEL_GIT_PULL_REQUEST_ID → if a the pull request ID exists, a preview build is triggered 

echo "Initial check - waiting for Vercel env vars..."
echo "VERCEL_ENV=$VERCEL_ENV"
echo "VERCEL_GIT_PULL_REQUEST_ID=$VERCEL_GIT_PULL_REQUEST_ID"
echo "VERCEL_GIT_COMMIT_REF=$VERCEL_GIT_COMMIT_REF"

PRODUCTION_BRANCH="main"

# Handle Production Environment
if [[ "$VERCEL_ENV" == "production" ]]; then
    echo "=== PRODUCTION ENVIRONMENT DETECTED ==="
    if [[ "$VERCEL_GIT_COMMIT_REF" == "$PRODUCTION_BRANCH" ]]; then
        echo "Production build on main branch - BUILDING"
        exit 1
    fi
fi

# Handle Preview Environment  
if [[ "$VERCEL_ENV" == "preview" ]]; then
    echo "=== PREVIEW ENVIRONMENT DETECTED ==="
    
    # Check if PR ID already exists
    if [[ -n "$VERCEL_GIT_PULL_REQUEST_ID" ]]; then
        echo "Preview build with existing PR ID ($VERCEL_GIT_PULL_REQUEST_ID) - BUILDING"
        exit 1
    fi
    
    # PR ID is empty, wait and poll for it
    echo "PR ID is empty, waiting for it to be generated..."
    for i in {1..5}; do
        echo "Attempt $i/5 - checking for PR ID..."
        
        # Check if PR ID has been set
        if [[ -n "$VERCEL_GIT_PULL_REQUEST_ID" ]]; then
            echo "PR ID found: ($VERCEL_GIT_PULL_REQUEST_ID) - BUILDING"
            exit 1
        fi

        if [[ $i -lt 5 ]]; then
            echo "Still no PR ID, waiting 3 more seconds..."
            sleep 3
        fi
    done
    
    # After all attempts, still no PR ID
    echo "No PR ID found after waiting - this appears to be a direct branch push, not a PR - SKIPPING BUILD"
    exit 0
fi

# Neither production nor preview environment
echo "Unknown environment ($VERCEL_ENV) - SKIPPING BUILD"
exit 0