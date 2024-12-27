import { graphql } from '#/graphql';

export const CREATE_FEATURE_FLAG = graphql(`
  mutation createFeatureFlag($newEntry: FeatureFlagDraft!) {
    createFeatureFlag(newEntry: $newEntry) {
      id
      createdAt
      updatedAt
      name
      description
      value
      environmentNames
      overrideRules {
        id
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
          type
          name
        }
        ... on ForcedValue {
          type
          value
        }
      }
    }
  }
`);

export const FEATURE_FLAG = graphql(`
  query featureFlag($id: ID!) {
    featureFlag(id: $id) {
      id
      createdAt
      updatedAt
      name
      description
      value
      environmentNames
      overrideRules {
        id
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
          type
          name
        }
        ... on ForcedValue {
          type
          value
        }
      }
    }
  }
`);

export const ALL_FEATURE_FLAGS = graphql(`
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
          type
          name
        }
        ... on ForcedValue {
          type
          value
        }
      }
    }
  }
`);

export const UPDATE_FEATURE_FLAG = graphql(`
  mutation updateFeatureFlag($partialEntry: PartialFeatureFlagWithStringId!) {
    updateFeatureFlag(partialEntry: $partialEntry) {
      id
      createdAt
      updatedAt
      name
      description
      value
      environmentNames
      overrideRules {
        id
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
          type
          name
        }
        ... on ForcedValue {
          type
          value
        }
      }
    }
  }
`);

export const DELETE_FEATURE_FLAG = graphql(`
  mutation deleteFeatureFlag($id: ID!) {
    deleteFeatureFlag(id: $id)
  }
`);
