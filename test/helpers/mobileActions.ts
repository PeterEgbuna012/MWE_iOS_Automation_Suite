import { browser } from '@wdio/globals';

export function mobileActions(): void {
  console.log('Mobile actions helper loaded');
}

export const CONSTANT = 'value';

export default class MobileActions {
  static async tap(element: WebdriverIO.Element): Promise<void> {
    await element.waitForDisplayed({ timeout: 10000 });
    await element.click();
  }

  static async type(element: WebdriverIO.Element, text: string): Promise<void> {
    await element.waitForDisplayed({ timeout: 10000 });
    await element.click();
    await element.clearValue();
    await element.setValue(text);
  }

  static async scrollToElement(element: WebdriverIO.Element): Promise<void> {
    if (browser.isIOS) {
      await browser.execute('mobile: scroll', { element: element.elementId, toVisible: true });
    } else {
      await element.scrollIntoView();
    }
  }

  static async swipeUp(duration = 1000): Promise<void> {
    const { height, width } = await browser.getWindowRect();
    const startX = width / 2;
    const startY = height * 0.8;
    const endY = height * 0.2;
    await browser.touchPerform([
      { action: 'press', options: { x: startX, y: startY } },
      { action: 'wait', options: { ms: duration } },
      { action: 'moveTo', options: { x: startX, y: endY } },
      { action: 'release' }
    ]);
  }

  static async isDisplayed(element: WebdriverIO.Element): Promise<boolean> {
    try { return await element.isDisplayed(); } catch { return false; }
  }
}
