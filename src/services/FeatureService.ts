/* Todo:
// CRUD individual flags
// fetch event data
// fetch all experiments
// CRUD individual experiments
*/
import FetchWrapper, {
  ParsedResponse,
  ResponseTypes,
} from "#/lib/FetchWrapper";
import {
  ExperimentDraft,
  FeatureFlag,
  FeatureFlagDraft,
  featureFlagSchema,
  ForcedValue,
  isObjectWithProps,
  OverrideRuleUnion,
  SchemaParseError,
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

  async getAllFeatures(): Promise<ResponseTypes<FeatureFlag[]>> {
    const response = await this.fetch.get("");
    if (!response.ok) {
      return response;
    }

    console.table(response.body);
    const safeParseResult = featureFlagSchema.array().safeParse(response.body);
    if (!safeParseResult.success) {
      throw new SchemaParseError(safeParseResult);
    }
    const parsed: FeatureFlag[] = featureFlagSchema.array().parse(response.body);

    const parsedResponse: ParsedResponse<FeatureFlag[]> = {
      ...response,
      ok: true,
      body: parsed,
    };

    return parsedResponse;
  }

  async getFeature(featureId: string): Promise<ResponseTypes<FeatureFlag>> {
    const response = await this.fetch.get(`/id/${featureId}`);
    if (!response.ok) {
      return response;
    } else {
      console.log({fetchedFlag: response.body})
      const safeParseResult = featureFlagSchema.safeParse(response.body);
      if (!safeParseResult.success) {
        throw new SchemaParseError(safeParseResult);
      }
      const parsedResponse: ParsedResponse<FeatureFlag> = {
        ...response,
        ok: true,
        body: featureFlagSchema.parse(response.body),
      };
  
      return parsedResponse;

    }

    // const parsed: FeatureFlag = featureFlagSchema.parse(response.body);
    // return { ...response, body: parsed};

  }

  async createFeature(featureContent: FeatureFlagDraft): Promise<ResponseTypes<{ fflagId: string }>> {
    const response = await this.fetch.post("", featureContent);
    if (!response.ok) return response;

    if ( !isObjectWithProps(response.body)
      || !('fflagId' in response.body) 
      || typeof response.body.fflagId !== 'string') {
      throw new TypeError('Expected a flag id to be returned!')
    }
    return response as ParsedResponse<{ fflagId: string }>;
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
    rule: OverrideRuleUnion
  ) {
    const response = await this.fetch.patch(`/id/${featureId}/addRule`, {
      id: featureId,
      environment: envName,
      rule: rule,
    });
    return response;
  }
}
