/* Todo:
// CRUD individual flags
// fetch event data
// fetch all experiments
// CRUD individual experiments
*/
import FetchWrapper from "#/lib/FetchWrapper";
import {
  ExperimentDraft,
  FeatureFlag,
  FeatureFlagDraft,
  ForcedValue,
} from "@estuary/types";

type FastifyError = {
  error: {
    code: number;
    message: string;
  };
};

const BASE_URL = import.meta.env.VITE_FLAG_SERVICE_URL;

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  mode: "cors",
};

const DEFAULT_REQUEST_OPTIONS = {};

export default class FeatureService {
  baseUrl: string;
  fetch: FetchWrapper;

  constructor() {
    this.fetch = new FetchWrapper(
      BASE_URL,
      DEFAULT_HEADERS,
      DEFAULT_REQUEST_OPTIONS
    );
  }

  async getAllFeatures(): Promise<FeatureFlag[]> {
    const response = await this.fetch.get("/fflags");
    return await response.json();
  }

  async getFeature(featureId: string): Promise<FeatureFlag> {
    const response = await this.fetch.get(`fflags/id/${featureId}`);
    return await response.json();
  }

  async createFeature(featureContent: FeatureFlagDraft): Promise<Response> {
    const response = await this.fetch.post("/fflags", featureContent);
    return await response.json();
  }

  async updateFeature(
    featureId: string,
    updateContent: Partial<FeatureFlagDraft>
  ): Promise<Response> {
    const updateObj = {
      id: featureId,
      ...updateContent,
    };
    const response = await this.fetch.patch(
      `/fflags/id/${featureId}`,
      updateObj
    );
    return await response.json();
  }

  async toggleEnvironment(featureId: string, environment, checked: boolean) {
    environment.enabled = checked;
    const envUpdate = {
      id: featureId,
      environments: { [`${environment.name}`]: environment },
    };
    const response = await this.fetch.patch(
      `/fflags/id/${featureId}`,
      envUpdate
    );
    return await response.json();
  }

  async deleteFeature(featureId) {
    const response = await this.fetch.delete(`/fflags/id/${featureId}`);
    return await response.json();
  }

  async patchFeature(featureId: string, updateContent) {
    const updateBody = {
      id: featureId,
      ...updateContent,
    };
    const response = await this.fetch.patch(
      `/fflags/id/${featureId}`,
      updateBody
    );
    return await response.json();
  }

  async addRule(
    featureId: string,
    envName: string,
    rule: ForcedValue | ExperimentDraft
  ) {
    const ruleBody = {
      id: featureId,
      environment: envName,
      rule: rule,
    };
    const response = await this.fetch.patch(
      `/fflags/id/${featureId}/addRule`,
      ruleBody
    );
    return await response.json();
  }
}
