import { $ } from '@wdio/globals';
import type { ChainablePromiseElement } from 'webdriverio';
import BasePage from './base.page.js';

export default class LoginPage extends BasePage {
  get inputUsername(): ChainablePromiseElement { return $('//XCUIElementTypeTextField[@name="Username or email" or @value="Username or email"]'); }
  get inputPassword(): ChainablePromiseElement { return $('(//XCUIElementTypeSecureTextField[@name="Password"])[1]'); }
  get allowButton(): ChainablePromiseElement { return $('//XCUIElementTypeButton[@name="Allow"]'); }
  get rejectButton(): ChainablePromiseElement { return $('//XCUIElementTypeButton[@name="Reject"]'); }
  get europeButton(): ChainablePromiseElement { return $('//XCUIElementTypeButton[@name="Europe"]'); }
  get usButton(): ChainablePromiseElement { return $('//XCUIElementTypeButton[@name="US"]'); }
  get worklistPage(): ChainablePromiseElement { return $('//XCUIElementTypeStaticText[@name="My Work List"]'); }
  get workOrderFirst(): ChainablePromiseElement { return $('//XCUIElementTypeOther[@name="Mobile Work Execution"]/XCUIElementTypeOther[5]'); }
  get workOrderSecond(): ChainablePromiseElement { return $('//XCUIElementTypeOther[@name="Mobile Work Execution"]/XCUIElementTypeOther[7]'); }
  get timeTracking(): ChainablePromiseElement { return $('//XCUIElementTypeOther[@name="Mobile Work Execution"]/XCUIElementTypeOther[6]'); }
  get task(): ChainablePromiseElement { return $('//XCUIElementTypeOther[@name="Mobile Work Execution"]/XCUIElementTypeOther[5]'); }
  get material(): ChainablePromiseElement { return $('//XCUIElementTypeOther[@name="Mobile Work Execution"]/XCUIElementTypeOther[7]'); }
  get workPage(): ChainablePromiseElement { return $('//XCUIElementTypeOther[@name="Mobile Work Execution"]'); }
  get startWorkButton(): ChainablePromiseElement { return $('//XCUIElementTypeButton[@name="Start Work" or @name="START WORK"]'); }
  get hamburgerIcon(): ChainablePromiseElement { return $('//XCUIElementTypeButton[@name=""]'); }
  get searchTextField(): ChainablePromiseElement { return $('//XCUIElementTypeTextField[@value="Search by Part Code or Description"]'); }
  get blankTextField(): ChainablePromiseElement { return $('//XCUIElementTypeTextField'); }
  get logoutButton(): ChainablePromiseElement { return $('//XCUIElementTypeButton[@name="Logout"]'); }

  async login(username: string, password: string): Promise<void> {
    await this.performStep('Login to application', async () => {
      await this.enterTextInField('Username or email', username);
      await this.enterPassword(password);
      await this.clickButtonByName('Sign In');
    });
  }

  async enterTextInField(placeholder: string, value: string): Promise<void> {
    await this.performStep(`Enter text in field: ${placeholder}`, async () => {
      const field = await $(`//XCUIElementTypeTextField[@value=${this.xpathText(placeholder)} or @name=${this.xpathText(placeholder)}]`);
      await field.waitForDisplayed({ timeout: 30000 });
      await field.click();
      await field.clearValue();
      await field.setValue(value);
    });
  }

  async enterPassword(value: string): Promise<void> {
    await this.performStep('Enter password', async () => {
      await this.inputPassword.waitForDisplayed({ timeout: 30000 });
      await this.inputPassword.click();
      await this.inputPassword.clearValue();
      await this.inputPassword.setValue(value);
    });
  }

  async clickAllow(): Promise<void> { await this.clickButtonByName('Allow'); }
  async clickReject(): Promise<void> { await this.clickButtonByName('Reject'); }
  async clickStartWork(): Promise<void> { await this.clickButtonByName('Start Work'); }

  async logout(): Promise<void> {
    await this.performStep('Logout from application', async () => {
      await this.clickButtonByName('');
      await this.clickButtonByName('Logout');
    });
  }
}
