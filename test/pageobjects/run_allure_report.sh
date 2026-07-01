#!/bin/bash

echo "======================================"
echo "  ALLURE REPORT GENERATION STARTED"
echo "======================================"

PROJECT_DIR="/Users/MWE_iOS_Automation_Suite"

cd "$PROJECT_DIR" || { echo "❌ Failed to enter project directory"; exit 1; }

# Check if allure-results exists
if [ ! -d "allure-results" ]; then
  echo "❌ ERROR: allure-results folder not found!"
  exit 1
fi

# Remove old report
if [ -d "allure-report" ]; then
  echo "Cleaning old report..."
  rm -rf allure-report
fi

# Generate report
echo "Generating Allure report..."
allure generate allure-results -o allure-report --clean

if [ $? -ne 0 ]; then
  echo "❌ ERROR: Failed to generate report!"
  exit 1
fi

# Open report
echo "Opening Allure report..."
allure open allure-report

echo "======================================"
echo "  REPORT OPENED SUCCESSFULLY"
echo "======================================"
``