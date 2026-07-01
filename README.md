# MWE iOS Automation Suite

Ready-to-use WebdriverIO + Appium + Cucumber + TypeScript automation suite for the MWE iOS app.

## Included

- Page Object Model
- iOS XPath locators
- Cucumber feature files
- Step definitions
- Allure reporting
- Screenshot on failure
- Appium iOS configuration

## Setup

```bash
npm install
```

Install Appium iOS driver if required:

```bash
npx appium driver install xcuitest
```

## Configure app path

Set your app path before running:

```bash
export IOS_APP_PATH=/path/to/your/MWE.app
export IOS_DEVICE_NAME="iPhone 15"
export IOS_PLATFORM_VERSION="17.0"
```

## Test data

Replace the placeholders in the feature files:

```gherkin
YOUR_ENV_CODE
YOUR_USERNAME
YOUR_PASSWORD
```

For security, real usernames/passwords were not committed into this downloadable suite.

## Run tests

```bash
npm run test:ios
```

## Generate Allure report

```bash
npm run allure:generate
npm run allure:open
```

## Notes

- Imports use `.ts` extensions because this is the recommended pattern for WDIO TypeScript ESM projects.
- Screenshots are saved into the `MWE-PROJECT` folder during execution.
- Feature files are under `test/features`.
- Step definitions are under `test/step-definitions`.
