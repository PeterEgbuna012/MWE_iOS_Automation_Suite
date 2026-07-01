import { $ } from '@wdio/globals';
import type { ChainablePromiseElement } from 'webdriverio';
import BasePage from './base.page.js';

export default class InitPage extends BasePage {
  get environmentTextField(): ChainablePromiseElement { return $('//XCUIElementTypeTextField[@value="Environment Code"]'); }
  get signInButton(): ChainablePromiseElement { return $('//XCUIElementTypeButton[@name="Sign In"]'); }
  get connectButton(): ChainablePromiseElement { return $('//XCUIElementTypeButton[@name="CONNECT"]'); }
  get selectRegionElement(): ChainablePromiseElement { return $('//XCUIElementTypeOther[@value="Select region"]'); }
  get notificationsButton(): ChainablePromiseElement { return $('//XCUIElementTypeButton[@name=""]/following-sibling::XCUIElementTypeButton[1]'); }
  get inputUsername(): ChainablePromiseElement { return $('//XCUIElementTypeTextField[@name="Username or email"]'); }
  get inputPassword(): ChainablePromiseElement { return $('//XCUIElementTypeSecureTextField[@name="Password"]'); }
  get backButton(): ChainablePromiseElement { return $('//XCUIElementTypeButton[@name=""]/preceding-sibling::XCUIElementTypeButton[1]'); }
  get doneButton(): ChainablePromiseElement { return $('//XCUIElementTypeStaticText[@name="DONE"]/preceding-sibling::XCUIElementTypeButton[1]'); }
  get dropdown(): ChainablePromiseElement { return $('//XCUIElementTypeOther[@value="Select region"]'); }

  async getPageTitle(): Promise<string> {
    return this.performStep('Get Init Page title', async () => {
      const titleElement = await $('//XCUIElementTypeStaticText');
      await titleElement.waitForDisplayed({ timeout: 30000 });
      return titleElement.getText();
    });
  }

  async isConnectButtonDisabled(): Promise<boolean> {
    return this.performStep('Check if Connect button is disabled', async () => {
      const disabled = await this.connectButton.getAttribute('disabled');
      return disabled !== null;
    });
  }

  async enterEnvironmentCode(environmentCode: string): Promise<void> {
    await this.performStep(`Enter environment code: ${environmentCode}`, async () => {
      await this.environmentTextField.waitForDisplayed({ timeout: 30000 });
      await this.environmentTextField.click();
      await this.environmentTextField.clearValue();
      await this.environmentTextField.setValue(environmentCode);
    });
  }

  async selectRegion(country: string): Promise<void> { await this.clickButtonByName(country, 30000); }
  async clickConnect(): Promise<void> { await this.clickButtonByName('CONNECT'); }
  async clickSignIn(): Promise<void> { await this.clickButtonByName('Sign In'); }
  getTextViewForReason(): ChainablePromiseElement { return $('//XCUIElementTypeTextView[@value="Please enter a reason for returning the work..."]'); }
  public get buttonMap(): Record<string, ChainablePromiseElement> { return { 'Sign In': this.signInButton, CONNECT: this.connectButton }; }
}
