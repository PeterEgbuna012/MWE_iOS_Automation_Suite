import { Given, When, Then } from '@wdio/cucumber-framework';
import { $, browser, driver, expect } from '@wdio/globals';
import LoginPage from '../pageobjects/login.page.js';
import BasePage from '../pageobjects/base.page.js';
import PhotoPage from '../pageobjects/photo.page.js';
import InitPage from '../pageobjects/init.page.js';
import WorkOrderPage from '../pageobjects/workOrder.page.js';

type WorkOrderPosition = 'first' | 'second';
type PageFlag = 'Shown' | 'Hidden';
type DateOffsetText = 'todays' | 'yesterdays' | 'tomorrows';

const loginPage = new LoginPage();
const basePage = new BasePage();
const photoPage = new PhotoPage();
const initPage = new InitPage();

const ordinals: Record<string, number> = {
  first: 1,
  second: 2,
  third: 3,
  fourth: 4,
  fifth: 5
};

const workOrderOrdinals: Record<string, number> = {
  first: 1,
  second: 2,
  third: 3,
  fourth: 4,
  fifth: 5
};

async function switchToNativeContext(): Promise<void> {
  const contexts = await driver.getContexts();
  const nativeContext = contexts.find(
    ctx => typeof ctx === 'string' && ctx.includes('NATIVE_APP')
  );

  if (nativeContext) {
    await driver.switchContext(nativeContext as string);
  }
}

async function switchToWebViewContext(): Promise<void> {
  const contexts = await driver.getContexts();
  const webviewContext = contexts.find(
    ctx => typeof ctx === 'string' && ctx.includes('WEBVIEW')
  );

  if (!webviewContext) {
    console.log(`WEBVIEW context not found. Available contexts: ${contexts.join(', ')}`);
    return;
  }

  await driver.switchContext(webviewContext as string);
}

async function hideKeyboardIfDisplayed(): Promise<void> {
  try {
    await driver.hideKeyboard();
  } catch {
    // Keyboard may not be visible. Ignore safely.
  }
}


async function waitForResourceDownloadCompletion(): Promise<void> {
  await switchToNativeContext();

  console.log('Waiting for resource download to complete...');

  const resourceDownloadXpath =
    '//XCUIElementTypeStaticText[contains(@name,"resources downloaded") or contains(@label,"resources downloaded")]';

  await browser.waitUntil(
    async () => {
      const elements = await $$(resourceDownloadXpath);

      // ✅ If element is gone → download finished
      if ((await elements.length) === 0) {
        console.log('✅ Download text disappeared → completed');
        return true;
      }

      const text = await elements[0].getText();
      console.log(`Download in progress: ${text}`);

      return false;
    },
    {
      timeout: 600000,
      interval: 5000,
      timeoutMsg: 'Resource download text did not disappear'
    }
  );

  console.log('✅ Resource download completed');
}



async function waitForPostLoginScreen(): Promise<void> {
  await switchToNativeContext();

  console.log('Waiting for post-login screen...');

  const postLoginXpath =
    '//XCUIElementTypeButton[@name="Reject"] | ' +
    '//XCUIElementTypeStaticText[@name="Reject"] | ' +
    '//XCUIElementTypeOther[@name="Reject"] | ' +
    '//XCUIElementTypeOther[@value="Reject"] | ' +
    '//XCUIElementTypeStaticText[contains(@name,"Worklist")] | ' +
    '//XCUIElementTypeOther[contains(@name,"Worklist")] | ' +
    '//XCUIElementTypeStaticText[contains(@label,"Worklist")] | ' +
    '//XCUIElementTypeOther[contains(@label,"Worklist")]';

  await browser.waitUntil(
    async () => {
      try {
        const elements = await $$(postLoginXpath);
        const elementCount = await elements.length;

        if (elementCount === 0) {
          return false;
        }

        return await elements[0].isDisplayed();
      } catch {
        return false;
      }
    },
    {
      timeout: 300000,
      interval: 5000,
      timeoutMsg: 'Post-login screen was not displayed.'
    }
  );

  console.log('Post-login screen displayed.');
}



async function handleIOSPermissionAlert(): Promise<void> {
  await switchToNativeContext();

  const allowButtonXpaths = [
    '//XCUIElementTypeButton[@name="Allow"]',
    '//XCUIElementTypeButton[@label="Allow"]',
    '//XCUIElementTypeButton[contains(@name,"Allow")]',
    '//XCUIElementTypeButton[contains(@label,"Allow")]',
    '//XCUIElementTypeButton[@name="OK"]',
    '//XCUIElementTypeButton[@label="OK"]'
  ];

  for (const xpath of allowButtonXpaths) {
    try {
      const buttons = await $$(xpath);
      const buttonCount = await buttons.length;

      if (buttonCount > 0 && await buttons[0].isDisplayed()) {
        await buttons[0].click();
        console.log(`iOS permission popup handled using locator: ${xpath}`);
        return;
      }
    } catch {
      // Continue checking next locator
    }
  }

  try {
    await driver.acceptAlert();
    console.log('iOS alert accepted using driver.acceptAlert()');
  } catch {
    console.log('No iOS permission alert found');
  }
}


async function clickButton(buttonName: string): Promise<void> {
  console.log(`CLICK BUTTON FUNCTION CALLED: ${buttonName}`);

  await switchToNativeContext();
  await hideKeyboardIfDisplayed();

  const normalisedButtonName = buttonName.trim().toLowerCase();

  if (normalisedButtonName === 'Sign In') {
    console.log('Attempting to click Sign In button');

    await initPage.signInButton.waitForDisplayed({ timeout: 30000 });
    await initPage.signInButton.waitForEnabled({ timeout: 30000 });

    await browser.pause(1000);
    await initPage.signInButton.click();

    console.log('Sign In button clicked');

    await browser.pause(3000);

    await handleIOSPermissionAlert();

    try {
      await waitForResourceDownloadCompletion();
    } catch {
      console.log('Resource download text was not completed or not detected. Continuing to post-login screen wait.');
    }

    await waitForPostLoginScreen();

    return;
  }

  if (normalisedButtonName.includes('reject')) {
  console.log('Waiting for resource download BEFORE handling Reject...');

  await switchToNativeContext();

  const downloadXpath =
    '//XCUIElementTypeStaticText[contains(@name,"resources downloaded") or contains(@label,"resources downloaded")]';

  // ✅ Step 1: wait until download text disappears
  try {
    await browser.waitUntil(
      async () => {
        const downloadEls = await browser.$$(downloadXpath);
      const downloadCount = await downloadEls.length;

        if (downloadCount === 0) {
          console.log('✅ Download text disappeared → download completed');
          return true;
        }

        const text = await downloadEls[0].getText();
        console.log(`Download in progress: ${text}`);

        return false;
      },
      {
        timeout: 600000,
        interval: 5000
      }
    );
  } catch {
    console.log('Download text not found or already completed');
  }

  // ✅ small stabilisation time (important for iOS)
  await browser.pause(3000);

  const rejectXpath = '//XCUIElementTypeButton[@name="Reject"]';

  console.log('Waiting for Reject button...');

  let rejectButton: WebdriverIO.Element | undefined;

  // ✅ Step 2: wait for Reject to exist + be clickable
  try {
    await browser.waitUntil(
      async () => {
        const els = await browser.$$(rejectXpath);

        if (await els.length === 0) {
          console.log('Reject not present yet...');
          return false;
        }

        const el = els[0] as unknown as WebdriverIO.Element;

        const visible = await el.isDisplayed();
        const enabled = await el.isEnabled();

        if (visible && enabled) {
          // cast to WebdriverIO.Element to satisfy TS type compatibility
          rejectButton = el as WebdriverIO.Element;
          return true;
        }

        return false;
      },
      {
        timeout: 120000,
        interval: 3000,
        timeoutMsg: 'Reject button not visible after download'
      }
    );
  } catch {
    console.log('✅ Reject never appeared → skipping');
    return;
  }

  if (!rejectButton) {
    console.log('✅ Reject undefined → skipping');
    return;
  }

  console.log('✅ Clicking Reject button');

  await rejectButton.click();

  console.log('✅ Reject clicked successfully');

  return;
}



  if (normalisedButtonName === 'Done') {
    await WorkOrderPage.clickDoneButton();
    return;
  }

  if (normalisedButtonName === 'Logout') {
    await basePage.clickButtonByName(buttonName);
    return;
  }

  await basePage.clickButtonByName(buttonName);
}

Given('I am on the Init page', async () => {
  await switchToNativeContext();
  await initPage.getPageTitle();
});

When('I set {string} into Environment Code input field', async (envCode: string) => {
  await switchToNativeContext();
  await initPage.enterEnvironmentCode(envCode);
});

When('I set Region select field', async () => {
  await switchToNativeContext();
  await initPage.dropdown.waitForDisplayed({ timeout: 30000 });
  await initPage.dropdown.click();
});

When('I set Region as {string}', async (country: string) => {
  await switchToNativeContext();
  await initPage.selectRegion(country);
});

Then('Connect button is disabled', async () => {
  await switchToNativeContext();
  await expect(initPage.connectButton).toHaveAttribute('disabled');
});

Then('I can connect to the Environment', async () => {
  await switchToNativeContext();
  await initPage.clickConnect();
});

Then('signIn option shows up', async () => {
  await switchToNativeContext();
  await initPage.signInButton.waitForDisplayed({ timeout: 30000 });
  await expect(initPage.signInButton).toBeDisplayed();
});

When('I switch to the web view context', async () => {
  await switchToWebViewContext();
});

Then('I switch to native view context', async () => {
  await switchToNativeContext();
});

When('I enter username as {string}', async (username: string) => {
  await switchToNativeContext();

  const usernameField = initPage.inputUsername;
  await usernameField.waitForDisplayed({ timeout: 30000 });

  try {
    await usernameField.scrollIntoView();
  } catch {
    // Ignore if scroll is not supported
  }

  await usernameField.click();
  await usernameField.clearValue();
  await usernameField.setValue(username);
});

When('I enter password as {string}', async (password: string) => {
  await switchToNativeContext();

  const passwordField = initPage.inputPassword;
  await passwordField.waitForDisplayed({ timeout: 30000 });

  try {
    await passwordField.scrollIntoView();
  } catch {
    // Ignore if scroll is not supported
  }

  await passwordField.click();
  await passwordField.clearValue();
  await passwordField.setValue(password);

  await hideKeyboardIfDisplayed();

  await initPage.signInButton.waitForDisplayed({ timeout: 30000 });
  await expect(initPage.signInButton).toBeDisplayed();
});

Then('I click on SignIn button', async () => {
  await clickButton('Sign In');
});

Then('I see allow button', async () => {
  await handleIOSPermissionAlert();
});

Then('The Worklist page is open', async () => {
  await expect(loginPage.worklistPage).toBeDisplayed();
});

When(
  'I login with region {string}, environment {string}, username {string} and password {string}',
  async (country: string, envCode: string, username: string, password: string) => {
    await switchToNativeContext();

    await initPage.dropdown.waitForDisplayed({ timeout: 30000 });
    await initPage.dropdown.click();

    await initPage.selectRegion(country);
    await initPage.enterEnvironmentCode(envCode);
    await initPage.clickConnect();

    await initPage.signInButton.waitForDisplayed({ timeout: 30000 });
    await initPage.clickSignIn();

    await initPage.inputUsername.waitForDisplayed({ timeout: 30000 });
    await initPage.inputUsername.click();
    await initPage.inputUsername.clearValue();
    await initPage.inputUsername.setValue(username);

    await initPage.inputPassword.waitForDisplayed({ timeout: 30000 });
    await initPage.inputPassword.click();
    await initPage.inputPassword.clearValue();
    await initPage.inputPassword.setValue(password);

    await hideKeyboardIfDisplayed();

    await clickButton('Sign In');
    await switchToNativeContext();
  }
);

When(/^I click on "([^"]+)" button$/, async (buttonName: string) => {
  console.log(`CLICK STEP TRIGGERED: ${buttonName}`);
  await clickButton(buttonName);
});


When(
  /^I click on "([^"]+)" option$/,
  async (optionName: string): Promise<void> => {
    await switchToNativeContext();
    await basePage.clickOptionByName(optionName);
  }
);

Then('{string} text is displayed', async (text: string) => {
  await switchToNativeContext();
  await basePage.verifyTextDisplayed(text);
});

Then('I compare the {string} values', async (text: string) => {
  await switchToNativeContext();
  await basePage.verifyTextDisplayed(text);
});

Then('{string} button is displayed', async (button: string) => {
  await switchToNativeContext();

  const element = await $(`//XCUIElementTypeButton[@name="${button}"]`);
  await element.waitForDisplayed({ timeout: 30000 });
  await expect(element).toBeDisplayed();
});

// -------------------- WORK ORDER --------------------

When('I click at {string} WO', async (workorder: WorkOrderPosition) => {
  await switchToNativeContext();
  await basePage.clickWorkOrder(workorder);
});

Then('I click on {string} WO', async (workorder: WorkOrderPosition) => {
  await switchToNativeContext();
  await basePage.clickWorkOrder(workorder);
});


Then(/^WO page is "([^"]+)"$/, async (pageName: string) => {
  await switchToNativeContext();
  await basePage.verifyWOPage(pageName);
});

Then(/^The status of the work Order is in "([^"]+)"$/, async (status: string) => {
  await switchToNativeContext();
  await WorkOrderPage.verifyWorkOrderStatus(status);
});

Then('I verify the work order is in {string} and click the Pause button', async (expectedStatus: string) => {
  await switchToNativeContext();
  await basePage.verifyStatusAndClickPauseButton(expectedStatus);
});

Then('I click at button next to {string}', async (status: string) => {
  await switchToNativeContext();
  await basePage.clickLastButtonNextToStatus(status);
});

When('I handle {string} work order button', async (status: 'Ready' | 'In Progress' | 'On Hold') => {
  await switchToNativeContext();
  await basePage.handleWorkOrderButton(status);
});

When('I handle {string} action button', async (actionButton: string) => {
  await switchToNativeContext();
  await basePage.handleActionButton(actionButton);
});

// -------------------- WIDGETS --------------------
When("I press {string} widget", async (widget: string) => {
  await basePage.clickWidget(widget);
});


Then('I press the Hamburger icon', async () => {
  await switchToNativeContext();
  await loginPage.hamburgerIcon.waitForDisplayed({ timeout: 30000 });
  await loginPage.hamburgerIcon.click();
});

Then('I navigate {string} tab', async (tab: string) => {
  await switchToNativeContext();
  await basePage.clickElement(`//XCUIElementTypeStaticText[@name="${tab}"]`);
});

Then('I navigate to {string}', async (navigate: string) => {
  await switchToNativeContext();

  const xpathMap: Record<string, string> = {
    back: '//XCUIElementTypeButton[@name=""]',
    notifications: '//XCUIElementTypeButton[@name=""]',
    done: '//XCUIElementTypeStaticText[@name="DONE"]',
    default: '//XCUIElementTypeButton[@name=""]/preceding-sibling::XCUIElementTypeButton[1]'
  };

  await basePage.clickElement(xpathMap[navigate.toLowerCase()] || xpathMap.default);
});

Then('I enter on notifications', async () => {
  await driver.keys(['Enter']);
});

When('I select {string} date field', async (fieldLabel: 'Start Time' | 'End Time') => {
  await switchToNativeContext();

  if (fieldLabel === 'Start Time') {
    await WorkOrderPage.selectStartTimeField();
  } else {
    await WorkOrderPage.selectEndTimeField();
  }
});

Then('I set date as {string} date', async (offsetText: DateOffsetText) => {
  await switchToNativeContext();

  if (offsetText === 'todays') {
    await WorkOrderPage.setDateToToday();
  } else if (offsetText === 'yesterdays') {
    await WorkOrderPage.setDateToYesterday();
  } else {
    await WorkOrderPage.setDateToTomorrow();
  }

  await WorkOrderPage.clickDoneButton();
});

When('I set {string} value field to {string}', async (fieldName: string, value: string) => {
  await switchToNativeContext();
  await WorkOrderPage.setValueInField(fieldName, value);
});

Then(/^I set Description field to "([^"]*)"$/, async (text: string) => {
  await switchToNativeContext();
  await WorkOrderPage.setValueInField('description', text);
});

Then('I enter {string} in textfield {string}', async (text: string, textfield: string) => {
  await switchToNativeContext();

  if (!textfield) {
    await loginPage.blankTextField.waitForDisplayed({ timeout: 30000 });
    await loginPage.blankTextField.setValue(text);
    return;
  }

  const reasonField = initPage.getTextViewForReason();
  await reasonField.waitForDisplayed({ timeout: 30000 });
  await reasonField.setValue(text);
});

When('I enter {string} in the Inventory search field', async (item: string) => {
  await switchToNativeContext();

  const searchField = await $('//XCUIElementTypeTextField[@value="Search by Part Code or Description"]');
  await basePage.enterText(searchField, item);
});

When('I select the {word} item {string} from the search results', async (position: string, itemName: string) => {
  await switchToNativeContext();

  const index = ordinals[position.toLowerCase()];

  if (!index) {
    throw new Error(`Invalid position: ${position}`);
  }

  await basePage.selectItemByIndex(itemName, index);
});

Then('I select Inventory material with available balance', async () => {
  await switchToNativeContext();
  await basePage.selectInventoryWithAvailableBalance(1);
});

Then('I select second Inventory material with available balance', async () => {
  await switchToNativeContext();
  await basePage.selectInventoryWithAvailableBalance(2);
});

Then('I click on {string} field', async (fieldName: string) => {
  await switchToNativeContext();
  await WorkOrderPage.clickField(fieldName);
});

When('I enter {string} in the location search field', async (locationName: string) => {
  await switchToNativeContext();
  await WorkOrderPage.enterLocationSearch(locationName);
});

Then('I enter {string} in the select location search field', async (locationName: string) => {
  await switchToNativeContext();
  await basePage.clickField('select location');
  await WorkOrderPage.enterSelectLocation(locationName);
});

When('I select the location result with name {string}', async (locationName: string) => {
  await switchToNativeContext();
  await WorkOrderPage.selectLocationFromResult(locationName);
});

When(/^I select the location result with name "(.*)"$/, async (locationName: string) => {
  await switchToNativeContext();
  await WorkOrderPage.selectLocationFromResult(locationName);
});

Then('I select {string} location', async (locationName: string) => {
  await switchToNativeContext();
  await basePage.selectLocationByName(locationName);
});

Then('the location should be selected successfully', async () => {
  await switchToNativeContext();

  const selectedLocationText = await WorkOrderPage.getSelectedLocationText();

  expect(selectedLocationText).not.toEqual('');
  expect(selectedLocationText).not.toContain('');
});

Then('I verify location field is populated', async () => {
  await switchToNativeContext();

  const field = await $('//XCUIElementTypeTextField');
  await field.waitForDisplayed({ timeout: 30000 });

  const value = await field.getValue();
  expect(value.trim().length).toBeGreaterThan(0);
});

When('I click on {string} filter and select {string}', async (mainFilter: string, subFilter: string) => {
  await switchToNativeContext();
  await WorkOrderPage.selectFromFilter(mainFilter, subFilter);
});

Then('I click on {string} sort by option and select {string}', async (mainOption: string, subOption: string) => {
  await switchToNativeContext();
  await basePage.selectSortByOption(mainOption, subOption);
});

Then('I click on {string} outcome and select {string}', async (mainOption: string, subOption: string) => {
  await switchToNativeContext();
  await WorkOrderPage.selectFromDropdown(mainOption, subOption);
});

Then(/^the Follow-On page should be "(Shown|Hidden)"$/, async (flag: PageFlag) => {
  await switchToNativeContext();
  await basePage.verifyFollowOnPage(flag);
});

Then('I {string} {word} work order', async (action: string, positionWord: string) => {
  await switchToNativeContext();
  const position = workOrderOrdinals[positionWord.toLowerCase()];

  if (!position) {
    throw new Error(`Invalid work order position: "${positionWord}"`);
  }

  if (action.toLowerCase() === 'bookmark') {
    await basePage.bookmarkWorkOrder(position);
    return;
  }

  throw new Error(`Unsupported action: "${action}"`);
});

Then(/^I "([^"]*)" asset swap$/, async (buttonName: string) => {
  await switchToNativeContext();
  await WorkOrderPage.clickAssetSwapButton(buttonName);
});

Then('I select No Asset from Asset table records', async () => {
  await switchToNativeContext();
  await WorkOrderPage.selectNoAssetFromAssetTable();
});

Then('I select {string} Asset from Asset table records', async (assetName: string) => {
  await switchToNativeContext();
  await WorkOrderPage.selectAssetFromTable(assetName);
});

Then(/^I verify asset field is populated$/, async () => {
  await switchToNativeContext();

  const isPopulated = await WorkOrderPage.isAssetFieldPopulated();
  expect(isPopulated).toBe(true);
});

Then(/^comment is "Shown"$/, async () => {
  await switchToNativeContext();
  await WorkOrderPage.waitForCommentToBeShown();
});

Then('I compare the time value {string}', async (expectedValue: string) => {
  await switchToNativeContext();
  await WorkOrderPage.compareTimeLogValue(expectedValue);
});

Then('Photo is Visible', async () => {
  await switchToNativeContext();
  await photoPage.verifyPhotoVisible();
});

Then(/^I take a screenshot$/, async () => {
  await switchToNativeContext();
  await WorkOrderPage.takeScreenshot();
});

Then('I wait for page to load', async () => {
  await basePage.waitForPageToLoad();
});

async function $$(resourceDownloadXpath: string) {
  return browser.$$(resourceDownloadXpath);
}

When(
  /^I tap on task with number "([^"]+)"$/,
  async (taskNumber: string) => {
    await switchToNativeContext();
    await basePage.tapTaskByNumber(taskNumber);
  }
);

When(
  'I Filter work order table by {string}',
  async (searchValue: string) => {
    await switchToNativeContext();
    await WorkOrderPage.filterWorkOrderTable(searchValue);
  }
);

Then('I select a Failure Class', async () => {
    await switchToNativeContext();
    await basePage.selectFailureClass();
});

Then('I select a Problem Class', async () => {
    await switchToNativeContext();
    await basePage.selectProblemClass();
});

Then('I select a Cause Class', async () => {
    await switchToNativeContext();
    await basePage.selectCauseClass();
});

Then('I select a Remedy Class', async () => {
    await switchToNativeContext();
    await basePage.selectRemedyClass();
});

