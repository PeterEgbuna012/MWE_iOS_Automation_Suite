import { $, $$, expect } from '@wdio/globals';
import type { ChainablePromiseElement } from 'webdriverio';
import BasePage from './base.page.js';

class WorkOrderPage extends BasePage {
  public readonly addManualTimeEntryButton = '//XCUIElementTypeButton[@name="Add Manual Time Entry"]';
  public readonly addManualTimeEntryBtnAllCaps = '//XCUIElementTypeButton[@name="ADD MANUAL TIME ENTRY"]';
  public readonly StartTimeField = '//XCUIElementTypeOther[@name="Mobile Work Execution"]/XCUIElementTypeOther[18]/XCUIElementTypeOther';
  public readonly EndTimeField = '//XCUIElementTypeOther[@name="Mobile Work Execution"]/XCUIElementTypeOther[19]/XCUIElementTypeOther';
  public readonly DoneButton = '//XCUIElementTypeButton[@name="Done"]';
  public readonly ReturnStartTimeField = '//XCUIElementTypeOther[@name="Mobile Work Execution"]/XCUIElementTypeOther[18]/XCUIElementTypeOther';
  public readonly ReturnEndTimeField = '//XCUIElementTypeOther[@name="Mobile Work Execution"]/XCUIElementTypeOther[19]/XCUIElementTypeOther';
  private readonly noAssetSelector = '(//XCUIElementTypeStaticText[@name=""])[1]';
  private readonly confirmButton = '//XCUIElementTypeButton[@name="CONFIRM"]';
  private readonly swapButton = '//XCUIElementTypeButton[@name=" Search All Parts"]';

  get AddManualTimeEntryButton(): ChainablePromiseElement { return $('//XCUIElementTypeButton[@name="ADD MANUAL TIME ENTRY"]'); }
  get commentClickElement(): ChainablePromiseElement { return $('//XCUIElementTypeOther[@name="Mobile Work Execution"]/XCUIElementTypeOther[4]'); }
  get commentInfoElement(): ChainablePromiseElement { return $('//XCUIElementTypeStaticText[@name="Comment Info"]'); }
  get assetField(): ChainablePromiseElement { return $('(//XCUIElementTypeTextField)[2]'); }
  get locationSearchField(): ChainablePromiseElement { return $('//XCUIElementTypeTextField[@value="Search Locations"]'); }
  get selectLocationSearchField(): ChainablePromiseElement { return $('//XCUIElementTypeTextField[@value="Select Location"]'); }
  get selectedLocationLabel(): ChainablePromiseElement { return $('//XCUIElementTypeStaticText[@name="SelectedLocationLabel" or @name="selectedLocationLabel"]'); }
  get allUpdatesSortOption(): ChainablePromiseElement { return $('//XCUIElementTypeOther[@value="All Updates"]'); }
  get commentsSortOption(): ChainablePromiseElement { return $('//XCUIElementTypeButton[@name="Comments"]'); }
  get followOnsSortOption(): ChainablePromiseElement { return $('//XCUIElementTypeButton[@name="Follow-Ons"]'); }
  get workflowSortOption(): ChainablePromiseElement { return $('//XCUIElementTypeButton[@name="Workflow"]'); }

  async clickAddManualTimeEntry(): Promise<void> { await this.clickElement(this.addManualTimeEntryButton); }
  async clickAddManualTimeEntryBtn(): Promise<void> { await this.clickElement(this.addManualTimeEntryBtnAllCaps); }

  async setValueInField(fieldName: string, value: string): Promise<void> {
    await this.performStep(`Set ${fieldName} field`, async () => {
      const inputField = await $(this.getSelectorForField(fieldName));
      await inputField.waitForDisplayed({ timeout: 30000 });
      await inputField.click();
      await inputField.clearValue();
      await inputField.setValue(value);
    });
  }

  async getValueFromField(fieldName: string): Promise<string> {
    return this.performStep(`Get value from ${fieldName} field`, async () => {
      const inputField = await $(this.getSelectorForField(fieldName));
      await inputField.waitForDisplayed({ timeout: 30000 });
      return (await inputField.getValue()) || (await inputField.getText());
    });
  }

  private getSelectorForField(fieldName: string): string {
    switch (fieldName.trim().toLowerCase()) {
      case 'summary': return '//XCUIElementTypeTextView[@value="Enter summary..."]';
      case 'details': return '//XCUIElementTypeTextView[@value="Enter details..."]';
      case 'fail task reason': return '//XCUIElementTypeOther[@name="Mobile Work Execution"]/XCUIElementTypeTextView[2]';
      case 'measurement input': return '//XCUIElementTypeTextField';
      case 'comment':
      case 'comments': return '//XCUIElementTypeOther[@name="Mobile Work Execution"]/XCUIElementTypeTextView';
      case 'description': return '//XCUIElementTypeTextView[@value="Please Enter Description"]';
      default: throw new Error(`Field "${fieldName}" is not supported.`);
    }
  }

  public getStatusElement(status: string): ChainablePromiseElement {
    if (!status) throw new Error('Status string is required.');
    return $(`(//XCUIElementTypeStaticText[@label=${this.xpathText(status)} or @name=${this.xpathText(status)}])[last()]`);
  }

  public async verifyWorkOrderStatus(expectedStatus: string): Promise<void> {
    await this.performStep(`Verify work order status: ${expectedStatus}`, async () => {
      const statusElement = this.getStatusElement(expectedStatus);
      await statusElement.waitForDisplayed({ timeout: 30000 });
      const actualStatus = await statusElement.getText();
      expect(actualStatus).toEqual(expectedStatus);
    });
  }

  public async selectStartTimeField(): Promise<void> { await this.clickElement(this.StartTimeField); }
  public async selectReturnStartTimeField(): Promise<void> { await this.clickElement(this.ReturnStartTimeField); }
  public async selectEndTimeField(): Promise<void> { await this.clickElement(this.EndTimeField); }
  public async selectReturnEndTimeField(): Promise<void> { await this.clickElement(this.ReturnEndTimeField); }
  public async clickDoneButton(): Promise<void> { await this.clickElement(this.DoneButton); }

  private getDateWithOffset(offset: number): Date { const date = new Date(); date.setDate(date.getDate() + offset); return date; }
  private getDateParts(offset: number): { day: string; month: string; year: string } {
    const date = this.getDateWithOffset(offset);
    return { day: date.getDate().toString(), month: date.toLocaleString('default', { month: 'long' }), year: date.getFullYear().toString() };
  }
  private async selectDate(offset: number): Promise<void> {
    await this.performStep(`Select date with offset ${offset}`, async () => {
      const { day, month, year } = this.getDateParts(offset);
      const possibleSelectors = [
        `//XCUIElementTypeStaticText[@name=${this.xpathText(day)}]`,
        `//XCUIElementTypeStaticText[@name=${this.xpathText(`${month} ${day}`)}]`,
        `//XCUIElementTypeStaticText[@name=${this.xpathText(`${month} ${day}, ${year}`)}]`
      ];
      for (const selector of possibleSelectors) {
        const elements = await $$(selector) as unknown as ChainablePromiseElement[];
        if ((elements?.length ?? 0) > 0) {
          await elements[0].waitForDisplayed({ timeout: 30000 });
          await elements[0].click();
          return;
        }
      }
      throw new Error(`Could not find date element for ${month} ${day}, ${year}`);
    });
  }
  public async setDateToYesterday(): Promise<void> { await this.selectDate(-1); }
  public async setDateToToday(): Promise<void> { await this.selectDate(0); }
  public async setDateToTomorrow(): Promise<void> { await this.selectDate(1); }

  async clickComment(): Promise<void> {
    await this.performStep('Click comment', async () => {
      await this.commentClickElement.waitForDisplayed({ timeout: 30000, timeoutMsg: 'Comment click element not visible.' });
      await this.commentClickElement.click();
    });
  }
  async getCommentInfoText(): Promise<string> {
    return this.performStep('Get comment info text', async () => {
      await this.commentInfoElement.waitForDisplayed({ timeout: 30000, timeoutMsg: 'Comment info not visible.' });
      return this.commentInfoElement.getText();
    });
  }
  async waitForCommentToBeShown(timeout = 30000): Promise<void> {
    await this.commentInfoElement.waitForDisplayed({ timeout, timeoutMsg: 'Expected comment to be shown, but it was not found.' });
  }
  async selectNoAssetFromAssetTable(): Promise<void> { await this.clickElement(this.noAssetSelector); }

  async selectAssetFromTable(assetName: string): Promise<void> {
    await this.performStep(`Select asset: ${assetName}`, async () => {
      const assetByNameSelector = `//XCUIElementTypeCell[.//XCUIElementTypeStaticText[@name=${this.xpathText(assetName)}]] | //XCUIElementTypeStaticText[@name=${this.xpathText(assetName)}]`;
      const assetElement = await $(assetByNameSelector);
      if (await assetElement.isExisting()) {
        await assetElement.waitForDisplayed({ timeout: 30000 });
        await assetElement.click();
        return;
      }
      await this.selectNoAssetFromAssetTable();
    });
  }

  async isAssetFieldPopulated(): Promise<boolean> { return this.isFieldPopulated(this.assetField); }

  public async clickAssetSwapButton(buttonName: string): Promise<void> {
    let selector: string;
    switch (buttonName.trim().toUpperCase()) {
      case 'CONFIRM': selector = this.confirmButton; break;
      case 'SWAP':
      case 'CONFIRM SWAP': selector = this.swapButton; break;
      default: throw new Error(`No button mapped for asset swap action: ${buttonName}`);
    }
    await this.clickElement(selector);
  }

  getLocationResultByName(name: string): ChainablePromiseElement {
    return $(`//XCUIElementTypeOther[@name=${this.xpathText(`${name}`)}] | //XCUIElementTypeStaticText[@name=${this.xpathText(`${name}`)}]`);
  }
  getSelectLocationResultByName(name: string): ChainablePromiseElement {
    return $(`//XCUIElementTypeOther[@name=${this.xpathText(name)}] | //XCUIElementTypeStaticText[@name=${this.xpathText(name)}] | //XCUIElementTypeButton[@name=${this.xpathText(name)}]`);
  }
  async enterLocationSearch(locationName: string): Promise<void> {
    await this.performStep(`Enter location search: ${locationName}`, async () => {
      await this.locationSearchField.waitForDisplayed({ timeout: 50000 });
      await this.locationSearchField.click();
      await this.locationSearchField.clearValue();
      await this.locationSearchField.setValue(locationName);
    });
  }
  async enterSelectLocation(locationName: string): Promise<void> {
    await this.performStep(`Enter select location: ${locationName}`, async () => {
      await this.selectLocationSearchField.waitForDisplayed({ timeout: 50000 });
      await this.selectLocationSearchField.click();
      await this.selectLocationSearchField.clearValue();
      await this.selectLocationSearchField.setValue(locationName);
    });
  }
  async selectLocationResults(locationName: string): Promise<void> {
    const result = this.getSelectLocationResultByName(locationName);
    await result.waitForDisplayed({ timeout: 50000 });
    await result.click();
  }
  async selectLocationFromResult(locationName: string): Promise<void> {
    const result = this.getLocationResultByName(locationName);
    await result.waitForDisplayed({ timeout: 50000 });
    await result.click();
  }
  async getSelectedLocationText(): Promise<string> {
    await this.selectedLocationLabel.waitForDisplayed({ timeout: 50000 });
    return this.selectedLocationLabel.getText();
  }
  getLocationSelector(locationName: string): string { return `//XCUIElementTypeStaticText[@name=${this.xpathText(locationName)}]`; }
  async selectLocation(locationName: string): Promise<void> {
    await this.performStep(`Select location: ${locationName}`, async () => {
      const locationElement = await $(this.getLocationSelector(locationName));
      if (!(await locationElement.isExisting())) throw new Error(`Location "${locationName}" not found.`);
      await locationElement.waitForDisplayed({ timeout: 30000 });
      await locationElement.click();
    });
  }
  private buildFilterSelector(name: string): string {
    return `//XCUIElementTypeButton[@name=${this.xpathText(name)}] | //XCUIElementTypeOther[@value=${this.xpathText(name)}] | //XCUIElementTypeOther[@name=${this.xpathText(name)}]`;
  }
  public async selectFromFilter(mainFilter: string, subFilter: string): Promise<void> {
    await this.clickElement(this.buildFilterSelector(mainFilter), 100000);
    await this.clickElement(this.buildFilterSelector(subFilter), 100000);
  }
  async selectFromDropdown(mainOption: string, subOption: string): Promise<void> {
    await this.clickOptionByName(mainOption, 100000);
    await this.clickOptionByName(subOption, 100000);
  }
  private getTimeLogElement(timeValue: string): ChainablePromiseElement { return $(`//XCUIElementTypeStaticText[@name=${this.xpathText(timeValue)}]`); }
  public async compareTimeLogValue(expectedValue: string): Promise<void> {
    const element = this.getTimeLogElement(expectedValue);
    await element.waitForDisplayed({ timeout: 50000, timeoutMsg: `Time log "${expectedValue}" was not found on screen` });
    const actualText = await element.getText();
    if (actualText !== expectedValue) throw new Error(`Time log mismatch: expected "${expectedValue}", but found "${actualText}"`);
  }
}

export default new WorkOrderPage();
