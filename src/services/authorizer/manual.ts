import { parse as parseUrl } from 'url';
import { parse as parseQuery } from 'querystring';

import { Chromium } from '../chromium';
import { Token } from '../token';
import { IAuthorizer } from '.';

type CDPWindow = { windowId: string };

// noinspection JSUnusedGlobalSymbols
export class ManualAuthorizer implements IAuthorizer {
  constructor(private chromium: Chromium) {}

  async authorize(): Promise<Token> {
    const page = await this.chromium.launch(
      'https://teams.microsoft.com/_#/apps/66aeee93-507d-479a-a3ef-8f494af43945/sections/classroom'
    );

    const session = await page.target().createCDPSession();
    const meta = await session.send('Browser.getWindowForTarget');

    page.on('load', () => {
      const { host } = parseUrl(page.url());

      session.send('Browser.setWindowBounds', {
        windowId: (meta as CDPWindow).windowId,
        bounds: {
          windowState:
            host === 'login.microsoftonline.com' ? 'normal' : 'minimized',
        },
      });
    });

    return new Promise<Token>((resolve, reject) => {
      page.on('response', (response) => {
        if (response.status() === 302) {
          const location = response.headers()['location'];
          const hash = parseQuery(location.split('#')[1]);
          const query = parseQuery(response.url().split('?', 2)[1]);
          const scope = query['scope'] as string | undefined;

          if (scope?.startsWith('https://onenote.com/')) {
            page.close();

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
