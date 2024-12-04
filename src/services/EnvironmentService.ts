import stringifyObject from 'stringify-object';
import {
  Environment,
  EnvironmentDraft,
  environmentSchema,
  SchemaParseError,
} from '@estuary/types';
import {
  GQLParsedFailureResponse,
  GQLParsedResponse,
  GQLParsedSuccessResponse,
} from '#/lib/fetchTypes';
import GraphQLFetchWrapper from '#/lib/GraphQLFetchWrapper';

export default class EnvironmentService {
  gqlApi: GraphQLFetchWrapper;

  constructor() {
    const DEFAULT_HEADERS = {
      mode: 'cors',
    };

    this.gqlApi = new GraphQLFetchWrapper({
      gqlUrl: import.meta.env.VITE_GRAPHQL_SERVICE_URL,
      defaultHeaders: DEFAULT_HEADERS,
      defaultRequestOptions: {},
    });
  }

  /**
   * Get up to `limit` Environments, starting from index `offset`
   */
  async getEnvironments(
    limit?: number,
    offset?: number,
  ): Promise<GQLParsedResponse<Environment[]>> {
    // console.log('fetching environments');
    const startTime = Date.now();
    const query = /* gql */ `
      allEnvironments(limit: ${limit ?? null}, offset: ${offset ?? null}) {
        id
        name
        defaultEnabled
        createdAt
        updatedAt
        pinToLists
      }
    `;

    const response = await this.gqlApi.query<Environment[]>(query);
    // console.log({ response });

    if (!response.ok) {
      return {
        ok: false,
        body: response.body.data?.allEnvironments,
        errors: response.body.errors,
      };
    }

    const safeParseResult = environmentSchema
      .array()
      .safeParse(response.body.data.allEnvironments);
    if (!safeParseResult.success) {
      throw new SchemaParseError(safeParseResult);
    }

    const parsedResponse: GQLParsedSuccessResponse<Environment[]> = {
      ok: true,
      body: safeParseResult.data,
      errors: response.body.errors,
    };

    console.log(`fetched all environments in ~${Date.now() - startTime} ms`);
    return parsedResponse;
  }

  async findEnvironment(
    partial: Partial<Environment>,
  ): Promise<GQLParsedResponse<Environment>> {
    const query = /* gql */ `
      findMatchingEnvironments(partial: ${stringifyObject(partial, { singleQuotes: false })}, limit: 1) {
        id
        name
        defaultEnabled
        createdAt
        updatedAt
        pinToLists
      }
    `;

    const response = await this.gqlApi.query<Environment>(query);

    if (!response.ok) {
      const failure: GQLParsedFailureResponse<Environment> = {
        ok: false,
        body: response.body.data?.environment,
        errors: response.body.errors,
      };

      return failure;
    }

    const { environment } = response.body.data;
    // console.log({ fetchedEnvironment: environment });
    const safeParseResult = environmentSchema.safeParse(environment);
    if (!safeParseResult.success) {
      throw new SchemaParseError(safeParseResult);
    }
    const success: GQLParsedSuccessResponse<Environment> = {
      ok: true,
      body: safeParseResult.data,
      errors: response.body.errors,
    };

    return success;
  }

  async createEnvironment(
    content: EnvironmentDraft,
  ): Promise<GQLParsedResponse<Environment>> {
    const mutation = /* gql */ `
      createEnvironment(newEntry: ${stringifyObject(content, { singleQuotes: false })}
      ) {
        id
        createdAt
        updatedAt
        name
        defaultEnabled
        pinToLists
      }
    `;
    const response = await this.gqlApi.mutate<Environment>(mutation);
    if (!response.ok) {
      const failure: GQLParsedFailureResponse<Environment> = {
        ok: false,
        body: response.body.data?.createEnvironment,
        errors: response.body.errors,
      };

      return failure;
    }

    const { createEnvironment } = response.body.data;
    const safeParseResult = environmentSchema.safeParse(createEnvironment);
    if (!safeParseResult.success) {
      throw new SchemaParseError(safeParseResult);
    }
    const success: GQLParsedSuccessResponse<Environment> = {
      ok: true,
      body: safeParseResult.data,
      errors: response.body.errors,
    };

    return success;
  }

  async updateEnvironment(
    environmentId: string,
    updates: Partial<Environment>,
  ): Promise<GQLParsedResponse<Environment>> {
    const updatesWithId = { ...updates, id: environmentId };
    // console.log({ updatesWithId });

    const mutation = /* gql */ `
      updateEnvironment(partialEntry: ${stringifyObject(updatesWithId, { singleQuotes: false })}) {
        id
        createdAt
        updatedAt
        name
        defaultEnabled
        pinToLists
      }
    `;

    // console.log({ mutation });

    const response = await this.gqlApi.mutate<Environment>(mutation);

    if (!response.ok) {
      const failure: GQLParsedFailureResponse<Environment> = {
        ok: false,
        body: response.body.data?.updateEnvironment,
        errors: response.body.errors,
      };

      return failure;
    }

    const { updateEnvironment } = response.body.data;
    // console.log({ updatedEnvironment: updateEnvironment });
    // consider removing these type validations
    const safeParseResult = environmentSchema.safeParse(updateEnvironment);
    if (!safeParseResult.success) {
      throw new SchemaParseError(safeParseResult);
    }

    const success: GQLParsedSuccessResponse<Environment> = {
      ok: true,
      body: safeParseResult.data,
      errors: response.body.errors,
    };

    return success;
  }

  async deleteEnvironment(
    environmentId: string,
  ): Promise<GQLParsedResponse<boolean>> {
    const mutation = /* gql */ `
      deleteEnvironment(id: ${environmentId})
    `;

    const response = await this.gqlApi.mutate<boolean>(mutation);
    if (!response.ok) {
      const failure: GQLParsedFailureResponse<boolean> = {
        ok: false,
        body: response.body.data?.deleteEnvironment,
        errors: response.body.errors,
      };

      return failure;
    }

    const success: GQLParsedSuccessResponse<boolean> = {
      ok: true,
      body: response.body.data.deleteEnvironment,
      errors: response.body.errors,
    };

    return success;
  }
}
