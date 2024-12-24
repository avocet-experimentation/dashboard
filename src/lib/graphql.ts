import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

export const apolloClient = new ApolloClient({
  uri: import.meta.env.VITE_GRAPHQL_SERVICE_URL,
  cache: new InMemoryCache(),
});

export const CREATE_ENVIRONMENT = gql`
  mutation createEnvironment($newEntry: EnvironmentDraft!) {
    createEnvironment(newEntry: $newEntry) {
      id
      createdAt
      updatedAt
      name
      defaultEnabled
      pinToLists
    }
  }
`;

export const GET_ENVIRONMENTS = gql`
  query allEnvironments($limit: Int, $offset: Int) {
    allEnvironments(limit: $limit, offset: $offset) {
      id
      name
      defaultEnabled
      createdAt
      updatedAt
      pinToLists
    }
  }
`;

export const FIND_ENVIRONMENTS = gql`
  query findMatchingEnvironments($partial: partialEnvironment!, $limit: Int) {
    findMatchingEnvironments(partial: $partial, limit: $limit) {
      id
      name
      defaultEnabled
      createdAt
      updatedAt
      pinToLists
    }
  }
`;
