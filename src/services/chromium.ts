import { launch, Page, Browser } from 'puppeteer';

export class Chromium {
  private browser?: Browser;

  constructor(
    private dataDirPath: string,
    private chromiumPath?: string,
  ) {}

  async launch(url: string, headless = false): Promise<Page> {
    if (!this.browser) {
      this.browser = await launch({
        headless,
        executablePath: this.chromiumPath,
        userDataDir: this.dataDirPath,
        defaultViewport: null,
        args: [
          '--no-sandbox',
          '--disable-gpu',
        ],
      });

      const pages = await this.browser.pages();

      if (pages.length > 0) {
        const page = pages[0]
        await page.goto(url);

        return page;
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
