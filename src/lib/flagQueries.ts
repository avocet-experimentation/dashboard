import { graphql } from '#/graphql';
// import { gql } from 'graphql-request';

// export const allFlagsQueryConcise = gql`
//   query allFeatureFlags($limit: Int, $offset: Int) {
//     allFeatureFlags(limit: $limit, offset: $offset) {
//       id
//       createdAt
//       updatedAt
//       name
//       description
//       value
//       environmentNames
//       overrideRules {
//         id
//         type
//         description
//       }
//     }
//   }
// `;

export const allFlagsQuery = graphql(`
  query allFeatureFlags($limit: Int, $offset: Int) {
    allFeatureFlags(limit: $limit, offset: $offset) {
      id
      createdAt
      updatedAt
      name
      description
      value
      environmentNames
      overrideRules {
        id
        type
        description
        environmentName
        enrollment {
          attributes
          proportion
        }
        status
        startTimestamp
        endTimestamp
        ... on ExperimentReference {
          name
        }
        ... on ForcedValue {
          value
        }
      }
    }
  }
`);
