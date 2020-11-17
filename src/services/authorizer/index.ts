import { Token } from '../token';

export * from './manual';

export interface IAuthorizer {
  authorize(): Promise<Token>,
}
