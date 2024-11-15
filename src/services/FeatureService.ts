/* Todo:
// CRUD individual flags
// fetch event data
// fetch all experiments
// CRUD individual experiments
*/
import { Experiment, FeatureFlag, ForcedValue } from "@estuary/types";

type FastifyError = {
  error: {
    code: number;
    message: string;
  };
};

export default class FeatureService {
  baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_FLAG_SERVICE_URL;
  }

  async getAllFeatures(): Promise<FeatureFlag[]> {
    const allFeatures = await fetch(this.baseUrl + "/admin/fflags", {
      headers: {
        "Content-Type": "application/json",
        mode: "cors",
      },
    });
    return await allFeatures.json();
  }

  async getFeature(featureId: string): Promise<FeatureFlag | null> {
    const feature = await fetch(
      this.baseUrl + `/admin/fflags/id/${featureId}`,
      {
        headers: {
          "Content-Type": "application/json",
          mode: "cors",
        },
      }
    );
    const featureJSON = await feature.json();
    if (feature.status === 404) {
      console.log(featureJSON.error);
      return null;
    }
    return featureJSON;
  }

  async createFeature(featureContent: FeatureFlag): Promise<Response> {
    try {
      const res = await fetch("http://localhost:3524/admin/fflags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          mode: "cors",
        },
        body: JSON.stringify(featureContent),
      });
      return res;
    } catch (error) {
      console.dir(error);
    }
  }

  async updateFeature(featureId, updateContent): Promise<Response> {
    const updateObj = {
      id: featureId,
      ...updateContent,
    };
    const updateRes = await fetch(
      this.baseUrl + `/admin/fflags/id/${featureId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          mode: "cors",
        },
        body: JSON.stringify(updateObj),
      }
    );
  }

  async toggleEnvironment(
    featureId: string,
    environment,
    checked: boolean,
    callback = undefined
  ) {
    environment.enabled = checked;
    const envUpdate = {
      id: featureId,
      environments: { [`${environment.name}`]: environment },
    };
    const updateRes = await fetch(
      this.baseUrl + `/admin/fflags/id/${featureId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          mode: "cors",
        },
        body: JSON.stringify(envUpdate),
      }
    );
    const updateJSON = await updateRes.json();
    if (updateJSON.code === 404) {
      console.log(updateJSON.error);
    } else {
      callback?.();
    }
  }

  async deleteFeature(featureId) {
    const deleteRes = await fetch(
      this.baseUrl + `/admin/fflags/id/${featureId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          mode: "cors",
        },
      }
    );
    const deleteJSON = await deleteRes.json();
  }

  async patchFeature(featureId: string, updateContent, callback) {
    const updateBody = {
      id: featureId,
      ...updateContent,
    };
    console.log(updateContent);
    const updateRes = await fetch(
      this.baseUrl + `/admin/fflags/id/${featureId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          mode: "cors",
        },
        body: JSON.stringify(updateBody),
      }
    );
    const updateJSON = await updateRes.json();
    if (updateJSON.status === 404) {
      console.log(updateJSON.error);
    } else {
      callback();
    }
  }

  async addRule(
    featureId: string,
    envName: string,
    rule: Omit<ForcedValue, "id"> | Omit<Experiment, "id">
  ) {
    const reqBody = {
      id: featureId,
      environment: envName,
      rule: rule,
    };
    const response = await fetch(
      this.baseUrl + `/admin/fflags/id/${featureId}/addRule`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          mode: "cors",
        },
        body: JSON.stringify(reqBody),
      }
    );
    return await response.json();
  }
}
