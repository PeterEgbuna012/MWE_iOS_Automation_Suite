import { $, expect as wdioExpect } from '@wdio/globals';
import type { ChainablePromiseElement } from 'webdriverio';
import BasePage from './base.page.js';

export default class WorklistPage extends BasePage {
  get worklistTitle(): ChainablePromiseElement { return $('//XCUIElementTypeStaticText[@name="My Work List"]'); }
  async verifyWorklistIsDisplayed(): Promise<void> {
    await this.performStep('Verify Worklist Page is displayed', async () => {
      await this.worklistTitle.waitForDisplayed({ timeout: 30000 });
      await expect(this.worklistTitle).toBeDisplayed();
    });
  }
}
function expect(element: ChainablePromiseElement) {
  return {
    async toBeDisplayed(): Promise<void> {
      await element.waitForDisplayed({ timeout: 30000 });
      await wdioExpect(element).toBeDisplayed();
    },
  };
}

