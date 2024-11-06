/* Todo:
// CRUD individual flags
// fetch event data
// fetch all experiments
// CRUD individual experiments
*/

export default class FeatureService {
  baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_FLAG_SERVICE_URL;
  }

  async getAllFeatures() {
    const allFlags = await fetch(this.baseUrl + "/admin/fflags", {
      headers: {
        "Content-Type": "application/json",
        mode: "cors",
      },
    });
    return await allFlags.json();
  }
}
