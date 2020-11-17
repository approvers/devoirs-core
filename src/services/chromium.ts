import { launch, Page, Browser } from 'puppeteer';

export class Chromium {
  private browser?: Browser;

  constructor(
    private dataDirPath: string,
    private chromiumPath?: string,
  ) {}

  async launch(url: string, width = 800, height = 600): Promise<Page> {
    if (!this.browser) {
      this.browser = await launch({
        executablePath: this.chromiumPath,
        userDataDir: this.dataDirPath,
        headless: false,
        defaultViewport: null,
        args: [
          '--no-sandbox',
          `--window-size=${width},${height}`,
          `--app=${url}`,
        ],
      });

      const pages = await this.browser.pages();

      if (pages.length > 0) {
        return pages[0];
      }
    }

    const page = await this.browser.newPage();
    await page.goto(url);

    return page;
  }

  quit(): Promise<void> {
    if (!this.browser) {
      return Promise.resolve();
    }

    return this.browser.close();
  }
}
