/* Todo:
// CRUD individual flags
// fetch event data
// fetch all experiments
// CRUD individual experiments
*/
import FetchWrapper, { ParsedResponse } from "#/lib/FetchWrapper";
import {
  ExperimentDraft,
  FeatureFlag,
  FeatureFlagDraft,
  featureFlagSchema,
  ForcedValue,
} from "@estuary/types";

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

  async getAllFeatures(): Promise<ParsedResponse<FeatureFlag[]> | Response> {
    const response = await this.fetch.get("");
    if (!response.ok) {
      return response as Response;
    }

    return { ...response, body: featureFlagSchema.array().parse(response.body) };
  }

  async getFeature(featureId: string): Promise<ParsedResponse<FeatureFlag> | Response> {
    const response = await this.fetch.get(`/id/${featureId}`);
    if (!response.ok) {
      return response as Response;
    }

    const parsed = featureFlagSchema.parse(response.body);
    return { ...response, body: parsed};
  }

  async createFeature(featureContent: FeatureFlagDraft) {
    const response = await this.fetch.post("", featureContent);
    return response;
  }

  async updateFeature(
    featureId: string,
    updateContent: Partial<FeatureFlagDraft>
  ) {
    const updateObj = {
      id: featureId,
      ...updateContent,
    };
    const response = await this.fetch.patch(`/id/${featureId}`, updateObj);
    return response;
  }

  async toggleEnvironment(featureId: string, environmentName: string) {
    const fetchResponse = await this.getFeature(featureId);
    if (!fetchResponse.ok) {
      throw new Error(`Couldn't fetch the feature flag with id ${featureId}!`);
    }

    const featureFlag = featureFlagSchema.parse(fetchResponse.body);
    FeatureFlagDraft.toggleEnvironment(featureFlag, environmentName);

    const envUpdate = {
      id: featureId,
      environmentNames: featureFlag.environmentNames,
    };
    const response = await this.fetch.patch(`/id/${featureId}`, envUpdate);
    return response;
  }

  async deleteFeature(featureId: string) {
    const response = await this.fetch.delete(`/id/${featureId}`);
    return response;
  }

  async patchFeature(featureId: string, updateContent: Partial<FeatureFlagDraft>) {
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
