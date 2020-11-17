export type Token = string;

export interface ITokenProvider {
  get: () => Promise<Token>;
  refresh: () => Promise<Token>;
}
