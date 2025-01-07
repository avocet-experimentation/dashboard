import { graphql } from '#/graphql';

export const CREATE_SDK_CONNECTION = graphql(`
  mutation createSDKConnection($newEntry: SDKConnectionDraft!) {
    createSDKConnection(newEntry: $newEntry) {
      id
      name
      allowedOrigins
      apiKeyHash
      description
      environmentId
      updatedAt
      createdAt
    }
  }
`);

export const ALL_SDK_CONNECTIONS = graphql(`
  query allSDKConnections($limit: Int, $offset: Int) {
    allSDKConnections(limit: $limit, offset: $offset) {
      id
      name
      allowedOrigins
      apiKeyHash
      description
      environmentId
      updatedAt
      createdAt
    }
  }
`);

export const UPDATE_SDK_CONNECTION = graphql(`
  mutation updateSDKConnection($partialEntry: PartialSDKConnectionWithId!) {
    updateSDKConnection(partialEntry: $partialEntry) {
      id
      name
      allowedOrigins
      apiKeyHash
      description
      environmentId
      updatedAt
      createdAt
    }
  }
`);

export const DELETE_SDK_CONNECTION = graphql(`
  mutation deleteSDKConnection($id: ID!) {
    deleteSDKConnection(id: $id)
  }
`);
