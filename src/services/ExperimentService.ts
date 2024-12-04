import FetchWrapper, {
  ParsedResponse,
  ResponseTypes,
} from '#/lib/FetchWrapper';
import {
  ExperimentDraft,
  experimentSchema,
  isObjectWithProps,
  SchemaParseError,
} from '@estuary/types';

const BASE_URL = import.meta.env.VITE_FLAG_SERVICE_URL + '/experiments';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  mode: 'cors',
};

const DEFAULT_REQUEST_OPTIONS = {};

export default class ExperimentService {
  fetch: FetchWrapper;

  constructor() {
    this.fetch = new FetchWrapper(
      BASE_URL,
      DEFAULT_HEADERS,
      DEFAULT_REQUEST_OPTIONS,
    );
  }

  async getAllExperiments(): Promise<ResponseTypes<ExperimentDraft[]>> {
    console.log('fetching experiments');
    const startTime = Date.now();
    const response = await this.fetch.get('');
    console.log(`fetched all experiments in ~${Date.now() - startTime} ms`);
    if (!response.ok) {
      return response;
    }

    console.table(response.body);
    const safeParseResult = experimentSchema.array().safeParse(response.body);
    if (!safeParseResult.success) {
      throw new SchemaParseError(safeParseResult);
    }

    // const parsed = response.body as FeatureFlag[];
    const parsedResponse: ParsedResponse<ExperimentDraft[]> = {
      ...response,
      ok: true,
      body: safeParseResult.data,
    };
    console.log(`returning all experiments in ~${Date.now() - startTime} ms`);
    return parsedResponse;
  }

  async getExperiment(
    experimentId: string,
  ): Promise<ResponseTypes<ExperimentDraft>> {
    const response = await this.fetch.get(`/id/${experimentId}`);
    if (!response.ok) {
      return response;
    } else {
      console.log({ fetchedExperiment: response.body });
      const safeParseResult = experimentSchema.safeParse(response.body);
      if (!safeParseResult.success) {
        throw new SchemaParseError(safeParseResult);
      }
      const parsedResponse: ParsedResponse<ExperimentDraft> = {
        ...response,
        ok: true,
        body: safeParseResult.data,
      };

      return parsedResponse;
    }
  }

  async createExperiment(
    experimentContent: ExperimentDraft,
  ): Promise<ResponseTypes<{ experimentId: string }>> {
    const response = await this.fetch.post('', experimentContent);
    if (!response.ok) return response;

    if (
      !isObjectWithProps(response.body) ||
      !('experimentId' in response.body) ||
      typeof response.body.experimentId !== 'string'
    ) {
      throw new TypeError('Expected a flag id to be returned!');
    }
    return response as ParsedResponse<{ experimentId: string }>;
  }

  async startExperiment(
    experimentId: string,
  ): Promise<ResponseTypes<ExperimentDraft>> {
    const response = await this.fetch.get(`/id/${experimentId}/start`);
    if (!response.ok) {
      return response;
    } else {
      console.log({ startedExperiment: response.body });
      const safeParseResult = experimentSchema.safeParse(response.body);
      if (!safeParseResult.success) {
        throw new SchemaParseError(safeParseResult);
      }
      const parsedResponse: ParsedResponse<ExperimentDraft> = {
        ...response,
        ok: true,
        body: safeParseResult.data,
      };

      return parsedResponse;
    }
  }
}
