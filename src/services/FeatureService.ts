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

const BASE_URL = import.meta.env.VITE_FLAG_SERVICE_URL + "/fflags";

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  mode: "cors",
};

const DEFAULT_REQUEST_OPTIONS = {};

export default class FeatureService {
  fetch: FetchWrapper;

  constructor() {
    this.fetch = new FetchWrapper(
      BASE_URL,
      DEFAULT_HEADERS,
      DEFAULT_REQUEST_OPTIONS
    );
  }

  async getAllFeatures(): Promise<FeatureFlag[]> {
    const response = await this.fetch.get("");
    return response;
  }

  async getFeature(featureId: string): Promise<FeatureFlag> {
    const response = await this.fetch.get(`/id/${featureId}`);
    return response;
  }

  async createFeature(featureContent: FeatureFlagDraft): Promise<Response> {
    const response = await this.fetch.post("", featureContent);
    return response;
  }

  async updateFeature(
    featureId: string,
    updateContent: Partial<FeatureFlagDraft>
  ): Promise<Response> {
    const updateObj = {
      id: featureId,
      ...updateContent,
    };
    const response = await this.fetch.patch(`/id/${featureId}`, updateObj);
    return response;
  }

  async toggleEnvironment(featureId: string, environment, checked: boolean) {
    environment.enabled = checked;
    const envUpdate = {
      id: featureId,
      environments: { [`${environment.name}`]: environment },
    };
    const response = await this.fetch.patch(`/id/${featureId}`, envUpdate);
    return response;
  }

  async deleteFeature(featureId) {
    const response = await this.fetch.delete(`/id/${featureId}`);
    return response;
  }

  async patchFeature(featureId: string, updateContent) {
    const updateBody = {
      id: featureId,
      ...updateContent,
    };
    const response = await this.fetch.patch(`/id/${featureId}`, updateBody);
    return response;
  }

  async addRule(
    featureId: string,
    envName: string,
    rule: ForcedValue | ExperimentDraft
  ) {
    const response = await this.fetch.patch(`/id/${featureId}/addRule`, {
      id: featureId,
      environment: envName,
      rule: rule,
    });
    return response;
  }
}
