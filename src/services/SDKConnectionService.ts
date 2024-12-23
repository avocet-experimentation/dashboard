import stringifyObject from 'stringify-object';
import {
  Environment,
  EnvironmentDraft,
  environmentSchema,
  SchemaParseError,
  SDKConnection,
  SDKConnectionDraft,
  sdkConnectionSchema,
} from '@avocet/core';
import {
  GQLParsedFailureResponse,
  GQLParsedResponse,
  GQLParsedSuccessResponse,
} from '#/lib/fetchTypes';
import GraphQLFetchWrapper from '#/lib/GraphQLFetchWrapper';

export default class SDKConnectionService {
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
  //needs update
  async getMany(
    limit?: number,
    offset?: number,
  ): Promise<GQLParsedResponse<SDKConnection[]>> {
    // console.log('fetching connections');
    const startTime = Date.now();
    const query = /* gql */ `
      allSDKConnections(limit: ${limit ?? null}, offset: ${offset ?? null}) {
        id
        createdAt
        updatedAt
        name
        environmentId
        description
      }
    `;

    const response = await this.gqlApi.query<SDKConnection[]>(query);
    // console.log({ response });

    if (!response.ok) {
      return {
        ok: false,
        body: response.body.data?.allSDKConnections,
        errors: response.body.errors,
      };
    }

    const safeParseResult = sdkConnectionSchema
      .array()
      .safeParse(response.body.data.allSDKConnections);
    if (!safeParseResult.success) {
      throw new SchemaParseError(safeParseResult);
    }

    const parsedResponse: GQLParsedSuccessResponse<SDKConnection[]> = {
      ok: true,
      body: safeParseResult.data,
      errors: response.body.errors,
    };

    console.log(`fetched all sdk conenctions in ~${Date.now() - startTime} ms`);
    return parsedResponse;
  }

  /**
   * Find environments that match the passed partial
   * @param limit defaults to 1
   */
  async find(
    partial: Partial<Environment>,
    limit: number = 1,
  ): Promise<GQLParsedResponse<Environment>> {
    const query = /* gql */ `
      findMatchingEnvironments(
        partial: ${stringifyObject(partial, { singleQuotes: false })},
        limit: ${limit}
      ) {
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

  //needs update
  async create(
    name: string, description: string, environmentId: string
  ): Promise<GQLParsedResponse<SDKConnection>> {
    const mutation = /* gql */ `
      createSDKConnection(name: ${name}, description: ${description}, environmentId: ${environmentId}) {
        id
        name
        description
        environmentId
      }
    `;
    const response = await this.gqlApi.mutate<SDKConnection>(mutation);
    if (!response.ok) {
      const failure: GQLParsedFailureResponse<SDKConnection> = {
        ok: false,
        body: response.body.data?.createEnvironment,
        errors: response.body.errors,
      };

      return failure;
    }

    const { createSDKConnection } = response.body.data;
    const safeParseResult = environmentSchema.safeParse(createSDKConnection);
    if (!safeParseResult.success) {
      throw new SchemaParseError(safeParseResult);
    }
    const success: GQLParsedSuccessResponse<SDKConnection> = {
      ok: true,
      body: safeParseResult.data, //TODO
      errors: response.body.errors,
    };

    return success;
  }

  async update(
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

  async delete(environmentId: string): Promise<GQLParsedResponse<boolean>> {
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
