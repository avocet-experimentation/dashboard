import { TypedDocumentString } from '#/graphql/graphql';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

export const apolloClient = new ApolloClient({
  uri: import.meta.env.VITE_GRAPHQL_SERVICE_URL,
  cache: new InMemoryCache(),
});

// /** Execute a GraphQL request */
// export async function execute<TResult, TVariables>(
//   query: TypedDocumentString<TResult, TVariables>,
//   ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
// ) {
//   const response = await fetch(import.meta.env.VITE_GRAPHQL_SERVICE_URL, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Accept: 'application/graphql-response+json',
//     },
//     body: JSON.stringify({
//       query,
//       variables,
//     }),
//   });

//   if (!response.ok) {
//     throw new Error('Network response was not ok');
//   }

//   return response.json() as TResult;
// }

// export const CREATE_ENVIRONMENT = gql`
//   mutation createEnvironment($newEntry: EnvironmentDraft!) {
//     createEnvironment(newEntry: $newEntry) {
//       id
//       createdAt
//       updatedAt
//       name
//       defaultEnabled
//       pinToLists
//     }
//   }
// `;

// export const GET_ENVIRONMENTS = gql`
//   query allEnvironments($limit: Int, $offset: Int) {
//     allEnvironments(limit: $limit, offset: $offset) {
//       id
//       name
//       defaultEnabled
//       createdAt
//       updatedAt
//       pinToLists
//     }
//   }
// `;

// export const FIND_ENVIRONMENTS = gql`
//   query findMatchingEnvironments($partial: PartialEnvironment!, $limit: Int) {
//     findMatchingEnvironments(partial: $partial, limit: $limit) {
//       id
//       name
//       defaultEnabled
//       createdAt
//       updatedAt
//       pinToLists
//     }
//   }
// `;
