export * from './models';
export * from './services';

import { ApiClient, ApiProxy, Chromium, ITokenProvider } from '.';

export const DEFAULT_BASE_URL = 'https://assignments.onenote.com/api/v1.0';

export type ChromiumOptions = {
  dataDirPath: string,
  chromiumPath?: string,
};

export type DevoirsOptions = {
  baseUrl?: string,
  tokenProvider: ITokenProvider,
};

// noinspection JSUnusedGlobalSymbols
export function createChromium(options: ChromiumOptions): Chromium {
  return new Chromium(
    options.dataDirPath,
    options.chromiumPath,
  );
}

// noinspection JSUnusedGlobalSymbols
export function createDevoirsClient(options: DevoirsOptions): ApiClient {
  return new ApiClient(
    new ApiProxy(
      options.baseUrl ?? DEFAULT_BASE_URL,
      options.tokenProvider,
    ),
  );
}
