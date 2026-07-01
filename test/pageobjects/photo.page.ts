import { $, expect } from '@wdio/globals';
import type { ChainablePromiseElement } from 'webdriverio';
import BasePage from './base.page.js';

export default class PhotoPage extends BasePage {
  get photoVisible(): ChainablePromiseElement { return $('//XCUIElementTypeImage'); }
  async verifyPhotoVisible(): Promise<void> {
    await this.performStep('Verify photo is visible', async () => {
      await this.photoVisible.waitForDisplayed({ timeout: 30000 });
      await expect(this.photoVisible).toBeDisplayed();
    });
  }
}

