#!/bin/bash

# Full Sync Script for MLS Listings
# Usage: ./scripts/full-sync.sh [secret] [base_url]
# Example: ./scripts/full-sync.sh "your-secret-here" "https://fprealty.vercel.app"

SECRET="${1:-$CRON_SECRET}"
BASE_URL="${2:-https://fprealty.vercel.app}"

if [ -z "$SECRET" ]; then
  echo "Error: No secret provided. Pass as first argument or set CRON_SECRET env var."
  exit 1
fi

ENDPOINT="$BASE_URL/api/sync-listings"
TOTAL_PROCESSED=0
ITERATION=1

echo "Starting full sync..."
echo "Endpoint: $ENDPOINT"
echo ""

# First call
echo "=== Iteration $ITERATION ==="
RESPONSE=$(curl -s "$ENDPOINT?mode=full&secret=$SECRET")
echo "$RESPONSE" | jq .

HAS_MORE=$(echo "$RESPONSE" | jq -r '.hasMoreData // false')
PROCESSED=$(echo "$RESPONSE" | jq -r '.processed // 0')
TOTAL_PROCESSED=$((TOTAL_PROCESSED + PROCESSED))

while [ "$HAS_MORE" = "true" ]; do
  ITERATION=$((ITERATION + 1))
  echo ""
  echo "=== Iteration $ITERATION ==="
  echo "Total processed so far: $TOTAL_PROCESSED"
  echo ""
  
  # Small delay between calls
  sleep 2
  
  RESPONSE=$(curl -s "$ENDPOINT?mode=full&secret=$SECRET")
  echo "$RESPONSE" | jq .
  
  # Check for errors
  ERROR=$(echo "$RESPONSE" | jq -r '.error // empty')
  if [ -n "$ERROR" ]; then
    echo ""
    echo "Error encountered: $ERROR"
    echo "Details: $(echo "$RESPONSE" | jq -r '.details // empty')"
    exit 1
  fi
  
  HAS_MORE=$(echo "$RESPONSE" | jq -r '.hasMoreData // false')
  PROCESSED=$(echo "$RESPONSE" | jq -r '.processed // 0')
  TOTAL_PROCESSED=$((TOTAL_PROCESSED + PROCESSED))
done

echo ""
echo "========================================="
echo "Full sync complete!"
echo "Total iterations: $ITERATION"
echo "Total records processed: $TOTAL_PROCESSED"
echo "========================================="
