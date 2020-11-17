import { parse as parseUrl } from 'url';
import { parse as parseQuery } from 'querystring';
import { Page } from 'puppeteer';

import { Chromium } from '../chromium';
import { Token } from '../token';
import { IAuthorizer } from '.';

class Automator {
  constructor(
    private page: Page,
  ) {
  }

  async login(email: string, password: string): Promise<void> {
    await this.type('input[type="email"]', email);
    await this.submit();

    await this.type('input[type="password"]:not([aria-hidden])', password);
    await this.submit();

    await this.click('input[type="checkbox"]');
    await this.submit();
  }

  private submit(): Promise<void> {
    return this.click('input[type="submit"]');
  }

  private click(selector: string): Promise<void> {
    return this.page
      .waitForSelector(selector)
      .then(el => el.click())
    ;
  }

  private type(selector: string, str: string): Promise<void> {
    return this.page
      .waitForSelector(selector)
      .then(el => el.type(str))
    ;
  }
}

// noinspection JSUnusedGlobalSymbols
export class AutomaticAuthorizer implements IAuthorizer {
  constructor(
    private chromium: Chromium,
    private email: string,
    private password: string,
  ) {
  }

  async authorize(): Promise<Token> {
    const page = await this.chromium.launch(
      'https://teams.microsoft.com/_#/apps/66aeee93-507d-479a-a3ef-8f494af43945/sections/classroom'
    );

    page.on('load', () => {
      const { host } = parseUrl(page.url());

      if (host === 'login.microsoftonline.com') {
        page.removeAllListeners('load');

        new Automator(page)
          .login(this.email, this.password)
          .catch(e => { throw e; })
        ;
      }
    });

    return new Promise<Token>((resolve, reject) => {
      page.on('response', (response) => {
        if (response.status() === 302) {
          const location = response.headers()['location'];
          const hash = parseQuery(location.split('#')[1]);
          const state = (hash['state'] as string | undefined)?.split('|');

          if (state && state[1] === 'https://onenote.com/') {
            page.removeAllListeners('response');

            this.chromium.quit();

            const token = hash['access_token'] as Token;
            if (token) {
              return resolve(hash['access_token'] as Token);
            }

            return reject('Failed to get the access token.');
          }
        }
      });
    });
  }
}
