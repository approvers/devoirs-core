import { ApiProxy } from './proxy';
import { Assignment, Class } from '../../models';

export class ApiClient {
  constructor(private proxy: ApiProxy) {}

  // noinspection JSUnusedGlobalSymbols
  async getClasses(): Promise<Class[]> {
    return await this.proxy.request(
      'GET',
      '/edu/me/classes',
    );
  }

  // noinspection JSUnusedGlobalSymbols
  async getAssignments(classId: string): Promise<Assignment[]> {
    return await this.proxy.request(
      'GET',
      `/edu/classes/${classId}/assignments`
    );
  }
}
