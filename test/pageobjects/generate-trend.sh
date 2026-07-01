#!/bin/bash

BASE_PATH="/Users/MWE_iOS_Automation_Suite"

PREVIOUS_REPORT="$BASE_PATH/allure-report"
RESULTS="$BASE_PATH/allure-results"

echo "=== Creating Allure Report with History ==="

# Copy history if it exists
if [ -d "$PREVIOUS_REPORT/history" ]; then
    echo "Found existing history. Copying..."
    rm -rf "$RESULTS/history"
    mkdir -p "$RESULTS/history"
    cp -r "$PREVIOUS_REPORT/history/"* "$RESULTS/history/"
else
    echo "No previous history found. Trends will start from this run."
fi

# Generate new report
echo "Generating new Allure report..."
allure generate "$RESULTS" --clean -o "$PREVIOUS_REPORT"

echo "=== Allure Report generated with trend support ==="
echo "Report folder: $PREVIOUS_REPORT"