#!/bin/bash

RESULTS_DIR="/Users/MWE_iOS_Automation_Suite/allure-results"

mkdir -p "$RESULTS_DIR"

cat > "$RESULTS_DIR/executor.json" <<EOL
{
  "name": "Local Run",
  "type": "local",
  "url": "",
  "buildOrder": 1,
  "buildName": "iOS 26.4.2 - Pro 11-inch (M5)",
  "buildUrl": "",
  "reportUrl": "",
  "reportName": "Allure Report"
}
EOL

echo "✅ Allure executor.json created"