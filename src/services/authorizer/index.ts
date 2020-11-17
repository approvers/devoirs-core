import { Token } from '../token';

export * from './automatic';
export * from './manual';

export interface IAuthorizer {
  authorize(): Promise<Token>,
}
