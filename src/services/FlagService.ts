/* Todo:
// CRUD individual flags
// fetch event data
// fetch all experiments
// CRUD individual experiments
*/

export default class FlagService {
  baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_FLAG_SERVICE_URL;
  }

  async getAllFlags() {
    const allFlags = await fetch(this.baseUrl + 'PLACEHOLDER');
    return allFlags;
  }
}