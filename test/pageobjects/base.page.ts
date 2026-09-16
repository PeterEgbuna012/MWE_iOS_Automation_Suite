import { $, $$, browser } from '@wdio/globals';
import allure from '@wdio/allure-reporter';
import type { ChainablePromiseElement, ChainablePromiseArray } from 'webdriverio';
import { format as dateFormat } from 'date-fns';
import path from 'path';
import * as fs from 'fs';

export default class BasePage {
  protected async performStep<T>(stepDescription: string, action: () => Promise<T>): Promise<T> {
    try {
      allure.startStep(stepDescription);
      const result = await action();
      allure.endStep('passed' as Parameters<typeof allure.endStep>[0]);
      return result;
    } catch (error) {
      const screenshot = await browser.takeScreenshot();
      allure.addAttachment('Screenshot on failure', Buffer.from(screenshot, 'base64'), 'image/png');
      allure.endStep('failed' as Parameters<typeof allure.endStep>[0]);
      throw error;
    }
  }

  protected xpathText(value: string): string {
    if (!value.includes("'")) return `'${value}'`;
    if (!value.includes('"')) return `"${value}"`;
    return `concat('${value.replace(/'/g, `', "'", '`)}')`;
  }

  protected async safeClickByXPath(xpath: string, timeout = 30000): Promise<void> {
    const element = await $(xpath);
    await element.waitForExist({ timeout, timeoutMsg: `Element does not exist: ${xpath}` });
    try {
      if (!(await element.isDisplayed())) await element.scrollIntoView();
    } catch {}
    await element.waitForDisplayed({ timeout, timeoutMsg: `Element not displayed: ${xpath}` });
    await browser.waitUntil(async () => (await element.isDisplayed()) && (await element.isEnabled()), {
      timeout,
      timeoutMsg: `Element not clickable: ${xpath}`
    });
    await element.click();
  }

  public async waitAndClick(element: WebdriverIO.Element | ChainablePromiseElement, timeout = 30000): Promise<void> {
    const resolvedElement = (await element) as WebdriverIO.Element;
    await resolvedElement.waitForDisplayed({ timeout });
    await resolvedElement.click();
  }

  public async delay(ms: number): Promise<void> {
    // Use native timer to avoid relying on webdriverio globals in TS context
    await new Promise<void>((resolve) => setTimeout(resolve, ms));
  }

  public getStaticTextElement(label: string): ChainablePromiseElement {
    return $(`//XCUIElementTypeStaticText[@name=${this.xpathText(label)}]`);
  }

  public async waitForElement(element: ChainablePromiseElement, timeout = 30000): Promise<void> {
    await element.waitForDisplayed({ timeout });
  }

  public async clickElement(selector: string, timeout = 30000): Promise<void> {
    await this.safeClickByXPath(selector, timeout);
  }

  public getButtonAliasXPath(name: string): string | undefined {
    const key = name.trim().toUpperCase();
    const aliases: Record<string, string> = {
      'START ICON': '//XCUIElementTypeButton[@name=""]',
      'PAUSE ICON': '//XCUIElementTypeButton[@name=""]',
      'RETURN ICON': '//XCUIElementTypeStaticText[@name=""]',
      'TEAM VIEW ICON': '//XCUIElementTypeButton[@name=""]',
      'TEAM VIEW FILES ICON': '//XCUIElementTypeStaticText[@name=""]',
      'BOOKMARK ICON': '(//XCUIElementTypeStaticText[@name=""])[1]',
      'TASK LOCATION': '//XCUIElementTypeStaticText[@name=""]',
      'MORE ACTION ICON': '//XCUIElementTypeButton[@name=""]',
      'BACK': '//XCUIElementTypeButton[@name=""]',
      'RESERVE': '(//XCUIElementTypeButton[@name=""])[1]',
      'PLUS': '//XCUIElementTypeStaticText[@name=""]',
      'START WORK': '//XCUIElementTypeButton[@name="START WORK" or @name="Start Work"]',
      'PAUSE': '//XCUIElementTypeButton[@name="Pause"]',
      'PAUSE WORK ORDER': '//XCUIElementTypeButton[@name="PAUSE WORK ORDER"]',
      'RETURN WORK': '//XCUIElementTypeButton[@name="Return Work Order"]',
      'RETURN WORK ORDER': '//XCUIElementTypeButton[@name="RETURN WORK ORDER"]',
      'WORK COMPLETE': '//XCUIElementTypeButton[@name="Work Complete"]',
      'PERMANENT FIX': '//XCUIElementTypeButton[@name="Permanent Fix"]',
      'COMPLETE': '//XCUIElementTypeButton[@name="Complete"]',
      'DONE': '//XCUIElementTypeButton[@name="Done"]',
      'ON HOLD': '//XCUIElementTypeButton[@name="On Hold"]',
      'SAVE': '//XCUIElementTypeButton[@name="SAVE"]',
      'NEXT': '//XCUIElementTypeButton[@name="NEXT"]',
      'CONFIRM': '//XCUIElementTypeButton[@name="CONFIRM"]',
      'CONFIRMED': '(//XCUIElementTypeButton[@name="CONFIRM"])[2]',
      'OK': '//XCUIElementTypeButton[@name="OK"]',
      'YES': '//XCUIElementTypeButton[@name="Yes"]',
      'NO': '//XCUIElementTypeButton[@name="No"]',
      'CLEAR': '//XCUIElementTypeStaticText[@name=""]',
      'SIGN OUT': '//XCUIElementTypeButton[@name="Sign Out"]',
      'LOGOUT': '//XCUIElementTypeButton[@name="Logout"]',
      'SELECT USERS': '//XCUIElementTypeButton[@name="SELECT USERS"]',
      'ADD USERS': '//XCUIElementTypeButton[@name="Add Users "]',
      'ADD SELECTED USERS': '//XCUIElementTypeButton[@name="Add Selected Users"]',
      'LOAD MORE USERS': '//XCUIElementTypeButton[@name="Load More Users"]',
      'ENTIRE TEAM': '//XCUIElementTypeButton[@name="ENTIRE TEAM"]',
      'USER 1': '(//XCUIElementTypeStaticText[@name="Select"])[1]',
      'USER 2': '(//XCUIElementTypeStaticText[@name="Select"])[2]',
      'USER 3': '(//XCUIElementTypeStaticText[@name="Select"])[3]',
      'USER 4': '(//XCUIElementTypeStaticText[@name="Select"])[4]',
      'USER 5': '(//XCUIElementTypeStaticText[@name="Select"])[5]',
      'ADD USER 1': '(//XCUIElementTypeStaticText[@name="Add"])[1]',
      'ADD USER 2': '(//XCUIElementTypeStaticText[@name="Add"])[2]',
      'ADD USER 3': '(//XCUIElementTypeStaticText[@name="Add"])[3]',
      'ADD USER 4': '(//XCUIElementTypeStaticText[@name="Add"])[4]',
      'ADD USER 5': '(//XCUIElementTypeStaticText[@name="Add"])[5]',
      'LOCATION EDIT': '//XCUIElementTypeStaticText[@name=""]',
      'LOCATION SEARCH': '//XCUIElementTypeTextField[@value="Search Locations"]',
      'ADD COMMENT BUTTON': '//XCUIElementTypeButton[@name="ADD COMMENT"]',
      'ADD COMMENT': '//XCUIElementTypeButton[@name="Add Comment"]',
      'CREATE FOLLOW-ON WORK ORDER': '//XCUIElementTypeButton[@name="Create Follow-On Work Order"]',
      'CREATE FOLLOW ON': '//XCUIElementTypeButton[@name="CREATE FOLLOW ON"]',
      'CREATE FOLLOW-ON': '//XCUIElementTypeButton[@name="CREATE FOLLOW-ON"]',
      'FAIL TASK': '//XCUIElementTypeButton[@name="FAIL TASK"]',
      'ATTACHMENTS TAB': '//XCUIElementTypeButton[@name="Attachments"] | //XCUIElementTypeStaticText[@name="Attachments"]',
      'HISTORY TAB': '//XCUIElementTypeStaticText[@name="History"]',
      'WORK TAB': '//XCUIElementTypeStaticText[@name="Work"]',
      'DETAILS TAB': '//XCUIElementTypeStaticText[@name="Details"]',
      'FILES TAB': '//XCUIElementTypeStaticText[@name="Files"]',
      'SEE MORE': '//XCUIElementTypeStaticText[@name="See More"]',
      'SEE LESS': '//XCUIElementTypeStaticText[@name="See Less"]',
      'CLOSE FILE': '//XCUIElementTypeButton[@name="QLOverlayDoneButtonAccessibilityIdentifier"]',
      'FILTER OPTIONS': '(//XCUIElementTypeOther[@value="All Updates"])[2]',
      'COMMENTS OPTION': '//XCUIElementTypeButton[@name="Comments"]',
      'FOLLOW-ONS OPTION': '//XCUIElementTypeButton[@name="Follow-Ons"]',
      'ALL UPDATES OPTION': '//XCUIElementTypeButton[@name="All Updates"]',
      'WORKFLOW OPTION': '//XCUIElementTypeButton[@name="Workflow"]',
      'SELECT A TEMPLATE': '//XCUIElementTypeOther[@value="Select a Template"]',
      'TYPE FIELD': '//XCUIElementTypeOther[@value="Select type..."]',
      'UPDATE': '//XCUIElementTypeButton[@name="UPDATE"]',
      'ADD TO LIST': '//XCUIElementTypeButton[@name="ADD TO LIST"]',
      'SEARCH': '//XCUIElementTypeButton[@name="SEARCH"]',
      'SEARCH ALL PARTS': '//XCUIElementTypeButton[@name=" Search All Parts"]',
      'GO TO ASSET SWAP': '//XCUIElementTypeButton[@name="GO TO ASSET SWAP"]',
      'TAP TO SELECT OUTBOUND ASSET': '//XCUIElementTypeOther[@name="Mobile Work Execution"]/XCUIElementTypeOther[8]',
      'TAP TO SELECT INBOUND ASSET': '//XCUIElementTypeOther[@name="Mobile Work Execution"]/XCUIElementTypeOther[11]',
      'SELECT ASSET': '(//XCUIElementTypeStaticText[@name="Select"])[1]',
      'SELECT': '//XCUIElementTypeStaticText[@name="Select"]',
      'NO ASSET': '(//XCUIElementTypeStaticText[@name=""])[1]',
      'RETURN LOCATION SELECT': '//XCUIElementTypeButton[@name="Select"]',
      'RESET APPLICATION': '//XCUIElementTypeButton[@name="Reset Application"]',
      'REST APPLICATION': '//XCUIElementTypeButton[@name="Reset Application"]',
      '377 AIR': '//XCUIElementTypeButton[@name="377 Air"]',
      '377 AUXILLARIES': '//XCUIElementTypeButton[@name="377 Auxillaries"]',
      '377 AUXILIARIES': '//XCUIElementTypeButton[@name="377 Auxillaries"]',
      '377 BOGIES': '//XCUIElementTypeButton[@name="377 Bogies"]',
      'ASSIGN TO ME WORK PRIORITY 1 - UNIT WITHDRAW FROM SERVICE': '//XCUIElementTypeButton[@name="Assign To Me Work Priority 1 - Unit Withdrawn from Service"]',
      'ASSIGN TO ME WORK PRIORITY 1 - UNIT WITHDRAWN FROM SERVICE': '//XCUIElementTypeButton[@name="Assign To Me Work Priority 1 - Unit Withdrawn from Service"]'
    };
    return aliases[key];
  }

  public async clickButtonByName(name: string, timeout = 50000): Promise<void> {
    await this.performStep(`Click button: ${name}`, async () => {
      const cleanName = name.trim();
      const aliasXPath = this.getButtonAliasXPath(cleanName);
      const xpath = aliasXPath ??
        `//XCUIElementTypeButton[@name=${this.xpathText(cleanName)}]` +
        ` | //XCUIElementTypeStaticText[@name=${this.xpathText(cleanName)}]` +
        ` | //XCUIElementTypeOther[@name=${this.xpathText(cleanName)}]` +
        ` | //XCUIElementTypeOther[@value=${this.xpathText(cleanName)}]`;
      await this.safeClickByXPath(xpath, timeout);
    });
  }

  public async clickOptionByName(name: string, timeout = 50000): Promise<void> {
    await this.performStep(`Click option: ${name}`, async () => {
      const cleanName = name.trim();
      const key = cleanName.toUpperCase();
      const optionAliases: Record<string, string> = {
        'FIRST RECORD': '(//XCUIElementTypeButton[contains(@name, ":")])[1]',
        'SECOND RECORD': '(//XCUIElementTypeButton[contains(@name, ":")])[2]',
        'THIRD RECORD': '(//XCUIElementTypeButton[contains(@name, ":")])[3]',
        'FOURTH RECORD': '(//XCUIElementTypeButton[contains(@name, ":")])[4]',
        'FIFTH RECORD': '(//XCUIElementTypeButton[contains(@name, ":")])[5]',
        'FAILURE CLASS': '//XCUIElementTypeOther[@value="Select Failure Class..."]',
        'PROBLEM CLASS': '//XCUIElementTypeOther[@value="Select Failure Problem..."]',
        'CAUSE CLASS': '//XCUIElementTypeOther[@value="Select Failure Cause..."]',
        'REMEDY CLASS': '//XCUIElementTypeOther[@value="Select Failure Remedy..."]',
        'SELECT OUTCOME': '//XCUIElementTypeOther[@value="Select outcome..."]',
        'ADD TO BACKLOG OPTIONS': '//XCUIElementTypeOther[@value="Add to backlog"]',
        'ADD TO BACKLOG': '//XCUIElementTypeOther[@value="Add to backlog"]',
        'FOUND IT, FIXED IT': '//XCUIElementTypeButton[@name="Found It, Fixed It"]',
        'ASSIGN TO ME': '//XCUIElementTypeButton[@name="Assign to me"]',
        'ASSIGN TO BACKLOG': '//XCUIElementTypeButton[@name="Assign to Backlog"]',
        'OUT': '//XCUIElementTypeStaticText[@name="OUT"]',
        'IN': '//XCUIElementTypeStaticText[@name="IN"]',
        'CLEAR': '//XCUIElementTypeStaticText[@name=""]',
        '377: AUXILIARIES': '//XCUIElementTypeOther[@value="377: AUXILIARIES"]',
        'SQR LIGHTING FAILED': '//XCUIElementTypeButton[@name="SQR 22(a) - Lighting - failed"]',
        'TSR TEMPORARY SPEED RESTRICTION': '//XCUIElementTypeButton[@name="TSR (Temporary Speed Restriction)"]',
        'INSPECTED NO FAULT FOUND': '//XCUIElementTypeButton[@name="Inspected (No Fault Found)"]',
        'INSPECTED VERIFIED COMPLETE': '//XCUIElementTypeButton[@name="Inspected (Verified Complete)"]',
        'STRIKE OTHER THAN TRAIN': '//XCUIElementTypeButton[@name="Strike (Other than Train)"]',
        'DUST BUILD UP': '//XCUIElementTypeButton[@name="Dirt / Dust Build Up"]',
        'LOSE CABLE': '//XCUIElementTypeButton[@name="Loose Cable"]',
        'REBOOT / RESET': '//XCUIElementTypeButton[@name="Reboot / Reset"]',
        'RELEASED & CLEANED': '//XCUIElementTypeButton[@name="Released & Cleaned"]',
        'AUTOMATIC PASSENGER COUNTER': '//XCUIElementTypeButton[@name="Automatic Passenger Counter" or @name="Automatic Passenger Counter"]',
        'PASSENGER ALARMS ALMS': '//XCUIElementTypeButton[@name="Passenger Alarms (ALM)"]',
        'CFR001 COIN GATE NOT OPENING': '//XCUIElementTypeButton[@name="CFR001 - Coin Gate Not Opening"]',
        'COIN PAYMENT UNAVAILABLE': '//XCUIElementTypeButton[@name="CFR001 - Coin Payment Unavailable"]',
        'CFR001 FAULT COIN REJECT BUTTON': '//XCUIElementTypeButton[@name="CFR001 - Faulty Coin Reject Button"]',
        'CFR001 GIVING IOU TICKET': '//XCUIElementTypeButton[@name="CFR001 - Giving IOU Ticket"]',
        'CFR001 INCORRECT CHANGE': '//XCUIElementTypeButton[@name="CFR001 - Incorrect Change"]',
        'CFR001 NOT GIVING CHANGE': '//XCUIElementTypeButton[@name="CFR001 - Not Giving Change"]',
        'CFR001 REJECTING COINS': '//XCUIElementTypeButton[@name="CFR001 - Rejecting Coins"]',
        'COS CARD ONLY': '//XCUIElementTypeButton[@name="COS - Card Only"]'
      };
      const xpath = optionAliases[key] ??
        `//XCUIElementTypeButton[@name=${this.xpathText(cleanName)}]` +
        ` | //XCUIElementTypeStaticText[@name=${this.xpathText(cleanName)}]` +
        ` | //XCUIElementTypeOther[@name=${this.xpathText(cleanName)}]` +
        ` | //XCUIElementTypeOther[@value=${this.xpathText(cleanName)}]`;
      await this.safeClickByXPath(xpath, timeout);
    });
  }

  public async clickWorkOrder(workorder: 'first' | 'second'): Promise<void> {
  let xpath: string;

  switch (workorder.toLowerCase()) {
    case 'first':
      xpath = '//XCUIElementTypeOther[@name="Mobile Work Execution"]/XCUIElementTypeOther[5]';
      break;

    case 'second':
      xpath = '//XCUIElementTypeOther[@name="Mobile Work Execution"]/XCUIElementTypeOther[6]';
      break;

    default:
      throw new Error(`Unsupported work order: ${workorder}`);
  }

  const el = await $(xpath);
  await el.waitForDisplayed({ timeout: 10000 });

  await el.click();
}

  public async verifyWorkListPage(): Promise<void> {
  const xpath = '//XCUIElementTypeStaticText[@name="My Work List"]';

  const el = await $(xpath);

  await el.waitForDisplayed({
    timeout: 30000,
    timeoutMsg: 'Worklist page not visible'
  });

  await expect(el).toBeDisplayed();
}


  public async clickWidget(widgetName: string, timeout = 50000): Promise<void> {
    const normalisedName = widgetName.trim().toLowerCase();
    const xpath = `//*[translate(@name,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')=${this.xpathText(normalisedName)}]` +
      ` | //*[translate(@value,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')=${this.xpathText(normalisedName)}]`;
    await this.safeClickByXPath(xpath, timeout);
  }

  public get descriptionField(): ChainablePromiseElement {
    return $('//XCUIElementTypeTextView[@value="Please Enter Description"]');
  }

  public async setDescription(text: string): Promise<void> {
    await this.performStep('Set description', async () => {
      await this.descriptionField.waitForDisplayed({ timeout: 50000 });
      await this.descriptionField.click();
      await this.descriptionField.clearValue();
      await this.descriptionField.addValue(text);
    });
  }

  public getDate(offset: 'todays' | 'yesterdays'): Date {
    const today = new Date();
    if (offset === 'yesterdays') today.setDate(today.getDate() - 1);
    return today;
  }

  public async setDateInPicker(date: Date, timeout = 50000): Promise<void> {
    await this.performStep('Set date in picker', async () => {
      const picker = await $('//XCUIElementTypePicker');
      await picker.waitForDisplayed({ timeout, timeoutMsg: 'Picker not displayed within timeout' });
      await picker.waitForEnabled({ timeout, timeoutMsg: 'Picker not enabled within timeout' });
      await picker.addValue(dateFormat(date, 'MM/dd/yyyy'));
    });
  }

  public async selectSortByOption(mainOption: string, subOption: string): Promise<void> {
    await this.performStep(`Select ${subOption} from ${mainOption}`, async () => {
      const mainSelector = `//XCUIElementTypeOther[@value=${this.xpathText(mainOption)}] | //XCUIElementTypeButton[@name=${this.xpathText(mainOption)}]`;
      const subSelector = `//XCUIElementTypeButton[@name=${this.xpathText(subOption)}] | //XCUIElementTypeOther[@value=${this.xpathText(subOption)}]`;
      await this.safeClickByXPath(mainSelector, 50000);
      await this.safeClickByXPath(subSelector, 50000);
    });
  }

  public async bookmarkWorkOrder(position: number): Promise<void> {
    await this.safeClickByXPath(`(//XCUIElementTypeStaticText[@name=""])[${position + 1}]`, 50000);
  }

  public async clickNthRecord(n = 1, timeout = 50000): Promise<void> {
    await this.safeClickByXPath(`(//XCUIElementTypeButton[contains(@name, ":")])[${n}]`, timeout);
  }

  public async clickField(fieldName: string, timeout = 50000): Promise<void> {
    const key = fieldName.trim().toUpperCase();
    const fields: Record<string, string> = {
      'LOCATION SEARCH': '//XCUIElementTypeTextField[@value="Search Locations"]',
      'SEARCH BY PART CODE OR DESCRIPTION': '//XCUIElementTypeTextField[@value="Search by Part Code or Description"]',
      'SELECT LOCATION': '//XCUIElementTypeTextField[@value="Select Location"]'
    };
    const xpath = fields[key] ??
      `//XCUIElementTypeTextField[@name=${this.xpathText(fieldName)}]` +
      ` | //XCUIElementTypeTextField[@value=${this.xpathText(fieldName)}]` +
      ` | //XCUIElementTypeOther[@name=${this.xpathText(fieldName)}]` +
      ` | //XCUIElementTypeOther[@value=${this.xpathText(fieldName)}]`;
    await this.safeClickByXPath(xpath, timeout);
  }

  private async getLocationElementByName(name: string): Promise<ChainablePromiseElement> {
    const xpath = `//XCUIElementTypeStaticText[@name=${this.xpathText(name)}] | //XCUIElementTypeOther[@name=${this.xpathText(name)}] | //XCUIElementTypeButton[@name=${this.xpathText(name)}]`;
    const element = await $(xpath);
    if (await element.isExisting()) return element;
    throw new Error(`No location element found for name: ${name}`);
  }

  public async selectLocationByName(name: string): Promise<void> {
    await this.performStep(`Select location: ${name}`, async () => {
      const element = await this.getLocationElementByName(name);
      await element.waitForDisplayed({ timeout: 50000 });
      await element.click();
    });
  }

  public readonly StartTimeField = '//XCUIElementTypeOther[@name="Mobile Work Execution"]/XCUIElementTypeOther[2]/XCUIElementTypeOther';
  public readonly EndTimeField = '//XCUIElementTypeOther[@name="Mobile Work Execution"]/XCUIElementTypeOther[3]/XCUIElementTypeOther';
  public readonly DoneButton = '//XCUIElementTypeButton[@name="Done"]';

  public async selectStartTimeField(): Promise<void> { await this.clickElement(this.StartTimeField); }

  public async selectDropdownOption(dropdownXpath: string, optionText: string): Promise<void> {
    await this.performStep(`Select ${optionText} from dropdown`, async () => {
      await this.safeClickByXPath(dropdownXpath, 50000);
      await this.clickOptionByName(optionText, 50000);
    });
  }

  public async clickLastButtonNextToStatus(status: string): Promise<void> {
    await this.performStep(`Click action button next to status "${status}"`, async () => {
      const xpath = `(//XCUIElementTypeStaticText[@name=${this.xpathText(status)}]/following-sibling::*[1])`;
      const elements = await $$(xpath);
      const lastDisplayed = await this.findLastDisplayed(elements);
      if (!lastDisplayed) throw new Error(`No visible action button found next to status: ${status}`);
      await lastDisplayed.click();
    });
  }

  public async verifyStatusAndClickPauseButton(expectedStatus: string): Promise<void> {
    await this.performStep(`Verify status ${expectedStatus} and click Pause`, async () => {
      const statusElements = await $$(`//XCUIElementTypeStaticText[@name=${this.xpathText(expectedStatus)}]`);
      const visibleStatus = await this.findVisibleElement(statusElements);
      if (!visibleStatus) throw new Error(`No visible status element found with text: ${expectedStatus}`);
      await expect(visibleStatus).toBeDisplayed();
      await this.clickButtonByName('Pause');
    });
  }

  protected async findLastDisplayed(elements: ChainablePromiseArray): Promise<WebdriverIO.Element | null> {
    let last: WebdriverIO.Element | null = null;
    for (const element of elements) {
      try { if (await element.isDisplayed()) last = element; } catch {}
    }
    return last;
  }

  protected async findVisibleElement(elements: ChainablePromiseArray): Promise<WebdriverIO.Element | null> {
    for (const element of elements) {
      try { if (await element.isDisplayed()) return element; } catch {}
    }
    return null;
  }

  public async enterText(element: ChainablePromiseElement | WebdriverIO.Element, text: string, timeout = 50000): Promise<void> {
    // Resolve ChainablePromiseElement to a concrete WebdriverIO.Element if needed
    const el = await (element as any) as WebdriverIO.Element;
    await el.waitForDisplayed({ timeout });
    await el.click();
    await el.clearValue();
    await el.setValue(text);
  }

  public async tapElementByXPath(xpath: string): Promise<void> { await this.safeClickByXPath(xpath, 50000); }

  public async selectItemByIndex(itemName: string, index: number): Promise<void> {
    await this.safeClickByXPath(`(//XCUIElementTypeStaticText[@name=${this.xpathText(itemName)}])[${index}]`, 50000);
  }

  public async selectInventoryWithAvailableBalance(index = 1): Promise<void> {
    await this.performStep(`Select inventory with available balance index ${index}`, async () => {
      const elements = await $$('//XCUIElementTypeStaticText[contains(@name,"Units Available: ")]');
      const positiveBalanceElements: WebdriverIO.Element[] = [];
      for (const element of elements) {
        const text = await element.getAttribute('name');
        const match = text?.match(/Units Available:\s*(\d+)/);
        if (match && Number.parseInt(match[1], 10) > 0) positiveBalanceElements.push(element);
      }
      if (positiveBalanceElements.length < index) throw new Error(`Only ${positiveBalanceElements.length} items with available balance found.`);
      const target = positiveBalanceElements[index - 1];
      await target.waitForDisplayed({ timeout: 50000 });
      await target.click();
    });
  }

  public async handleWorkOrderButton(status: 'Ready' | 'In Progress' | 'On Hold'): Promise<void> {
    await this.performStep(`Handle ${status} work order`, async () => {
      const startButton = await $('//XCUIElementTypeButton[@name="START WORK" or @name="Start Work"]');
      if ((await startButton.isExisting()) && (await startButton.isDisplayed())) {
        await startButton.click();
        return;
      }
      await this.clickLastButtonNextToStatus(status);
    });
  }

  public async handleActionButton(actionButton: string): Promise<void> {
    await this.performStep(`Click action button: ${actionButton}`, async () => {
      const xpath = `//XCUIElementTypeButton[@name=${this.xpathText(actionButton)}] | //XCUIElementTypeStaticText[@name=${this.xpathText(actionButton)}] | //XCUIElementTypeOther[@name=${this.xpathText(actionButton)}] | //XCUIElementTypeOther[@value=${this.xpathText(actionButton)}]`;
      const element = await $(xpath);
      if (await element.isExisting()) {
        await this.safeClickByXPath(xpath, 30000);
        return;
      }
      const buttons = await $$('//XCUIElementTypeButton');
      const lastDisplayed = await this.findLastDisplayed(buttons);
      if (!lastDisplayed) throw new Error(`Action button "${actionButton}" not found`);
      await lastDisplayed.click();
    });
  }

  public async takeScreenshot(fileName?: string): Promise<void> {
    const screenshotDir = 'MWE-PROJECT';
    if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const finalFileName = fileName || `screenshot-${timestamp}.png`;
    const fullPath = path.join(screenshotDir, finalFileName);
    await browser.saveScreenshot(fullPath);
    console.log(`Screenshot saved: ${fullPath}`);
  }

  public async isFieldPopulated(element: ChainablePromiseElement): Promise<boolean> {
    try {
      if (!(await element.isDisplayed())) return false;
      const value = await element.getValue();
      return value.trim().length > 0;
    } catch { return false; }
  }
public async selectFailureClass(): Promise<void> {

    await this.performStep(
        'Select Failure Class',
        async () => {

            await this.clickOptionByName('FAILURE CLASS');

            const firstRecord =
                '(//XCUIElementTypeButton)[2]';

            const element = await $(firstRecord);

            await element.waitForDisplayed({
                timeout: 30000
            });

            const value = await element.getAttribute('name');

            console.log(`Selected Failure Class: ${value}`);

            await element.click();
        }
    );
}

public async selectProblemClass(): Promise<void> {

    await this.performStep(
        'Select Problem Class',
        async () => {

            await this.clickOptionByName('PROBLEM CLASS');

            const firstRecord =
                '(//XCUIElementTypeButton)[2]';

            const element = await $(firstRecord);

            await element.waitForDisplayed({
                timeout: 30000
            });

            const value = await element.getAttribute('name');

            console.log(`Selected Problem Class: ${value}`);

            await element.click();
        }
    );
}
public async selectCauseClass(): Promise<void> {

    await this.performStep(
        'Select Cause Class',
        async () => {

            await this.clickOptionByName('CAUSE CLASS');

            const firstRecord =
                '(//XCUIElementTypeButton)[2]';

            const element = await $(firstRecord);

            await element.waitForDisplayed({
                timeout: 30000
            });

            const value = await element.getAttribute('name');

            console.log(`Selected Cause Class: ${value}`);

            await element.click();
        }
    );
}

public async selectRemedyClass(): Promise<void> {

    await this.performStep(
        'Select Remedy Class',
        async () => {

            await this.clickOptionByName('REMEDY CLASS');

            const firstRecord =
                '(//XCUIElementTypeButton)[2]';

            const element = await $(firstRecord);

            await element.waitForDisplayed({
                timeout: 30000
            });

            const value = await element.getAttribute('name');

            console.log(`Selected Remedy Class: ${value}`);

            await element.click();
        }
    );
}




public async tapTaskByNumber(
  taskNumber: string,
  timeout = 30000
): Promise<void> {

  await this.performStep(
    `Tap task ${taskNumber}`,
    async () => {

      const xpath =
        `//XCUIElementTypeStaticText[@name="${taskNumber}"] |
         //XCUIElementTypeButton[@name="${taskNumber}"] |
         //XCUIElementTypeOther[@name="${taskNumber}"]`;

      const element = await $(xpath);

      await element.waitForDisplayed({
        timeout,
        timeoutMsg: `Task ${taskNumber} not found`
      });

      await element.click();

      console.log(`✅ Task selected: ${taskNumber}`);
    }
  );
}

  public async waitForPageToLoad(): Promise<void> { await browser.pause(30000); }

  
  public async verifyFollowOnPage(flag: 'Shown' | 'Hidden'): Promise<void> {
    await this.performStep(`Verify Follow-On page is ${flag}`, async () => {
      const basePage = await $('//XCUIElementTypeOther[@name="Create Follow-On (1/2)"]');
      const addToBacklog = await $('//XCUIElementTypeOther[@value="Add to backlog"]');
      if (flag === 'Shown') {
        await basePage.waitForDisplayed({ timeout: 50000 });
        await expect(basePage).toBeDisplayed();
        await addToBacklog.waitForDisplayed({ timeout: 50000 });
        await expect(addToBacklog).toBeDisplayed();
      } else {
        await basePage.waitForDisplayed({ timeout: 50000, reverse: true });
        await expect(basePage).not.toBeDisplayed();
      }
    });
  }

  public async verifyWOPage(pageName: string): Promise<void> {
  await this.performStep(`Verify WO page: ${pageName}`, async () => {

    const xpath = `//XCUIElementTypeOther[@name=${this.xpathText(pageName)}]/XCUIElementTypeOther[1]`;

    const element = await $(xpath);

    await element.waitForDisplayed({
      timeout: 50000,
      timeoutMsg: `WO page "${pageName}" not displayed`
    });

    await expect(element).toBeDisplayed();
  });
}

  public async verifyTextDisplayed(text: string): Promise<void> {
    await this.performStep(`Verify text displayed: ${text}`, async () => {
      const xpath = `//XCUIElementTypeStaticText[contains(@name,${this.xpathText(text)})] | //XCUIElementTypeButton[contains(@name,${this.xpathText(text)})] | //XCUIElementTypeOther[contains(@name,${this.xpathText(text)})]`;
      const element = await $(xpath);
      await element.waitForDisplayed({ timeout: 50000 });
      await expect(element).toBeDisplayed();
    });
  }
}

export async function clickButtonByName(name: string, timeout = 50000): Promise<void> {
  const safeName = !name.includes("'") ? `'${name}'` : `"${name}"`;
  const button = await $(`//XCUIElementTypeButton[@name=${safeName}]`);
  await button.waitForDisplayed({ timeout });
  await button.click();
}
function expect(element: ChainablePromiseElement | WebdriverIO.Element): any {
  const globalExpect = (globalThis as any).expect;
  if (typeof globalExpect !== 'function') {
    throw new Error('Global expect is not available.');
  }
  return globalExpect(element);
}



