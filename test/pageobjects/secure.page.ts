import { $ } from '@wdio/globals';
import type { ChainablePromiseElement } from 'webdriverio';
import BasePage from './base.page.js';

class SecurePage extends BasePage {
  get flashAlert(): ChainablePromiseElement { return $('#flash'); }
  async getFlashAlertText(): Promise<string> {
    return this.performStep('Get flash alert text', async () => {
      await this.flashAlert.waitForDisplayed({ timeout: 30000 });
      return this.flashAlert.getText();
    });
  }
  async isFlashAlertDisplayed(): Promise<boolean> {
    return this.performStep('Check if flash alert is displayed', async () => {
      try { return await this.flashAlert.isDisplayed(); } catch { return false; }
    });
  }
}
export default new SecurePage();
