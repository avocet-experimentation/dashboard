import { graphql } from '#/graphql';

export const CREATE_EXPERIMENT = graphql(`
  mutation createExperiment($newEntry: ExperimentDraft!) {
    createExperiment(newEntry: $newEntry) {
      id
      name
      environmentName
      status
      type
      description
      hypothesis
      startTimestamp
      endTimestamp
      enrollment {
        attributes
        proportion
      }
      groups {
        id
        name
        description
        proportion
        cycles
        sequence
      }
      definedTreatments {
        id
        name
        duration
        flagStates {
          id
          value
        }
      }
      dependents {
        fieldName
        fieldDataType
      }
      flagIds
      createdAt
      updatedAt
    }
  }
`);

export const EXPERIMENT = graphql(`
  query experiment($id: ID!) {
    experiment(id: $id) {
      id
      name
      environmentName
      status
      type
      description
      hypothesis
      startTimestamp
      endTimestamp
      enrollment {
        attributes
        proportion
      }
      groups {
        id
        name
        description
        proportion
        cycles
        sequence
      }
      definedTreatments {
        id
        name
        duration
        flagStates {
          id
          value
        }
      }
      dependents {
        fieldName
        fieldDataType
      }
      flagIds
      createdAt
      updatedAt
    }
  }
`);

export const ALL_EXPERIMENTS = graphql(`
  query allExperiments($limit: Int, $offset: Int) {
    allExperiments(limit: $limit, offset: $offset) {
      id
      createdAt
      updatedAt
      name
      environmentName
      status
    }
  }
`);

export const UPDATE_EXPERIMENT = graphql(`
  mutation updateFeatureFlag($partialEntry: PartialFeatureFlagWithStringId!) {
    updateFeatureFlag(partialEntry: $partialEntry) {
      id
      name
      environmentName
      status
      type
      description
      hypothesis
      startTimestamp
      endTimestamp
      enrollment {
        attributes
        proportion
      }
      groups {
        id
        name
        description
        proportion
        cycles
        sequence
      }
      definedTreatments {
        id
        name
        duration
        flagStates {
          id
          value
        }
      }
      dependents {
        fieldName
        fieldDataType
      }
      flagIds
    }
  }
`);

export const DELETE_EXPERIMENT = graphql(`
  mutation deleteExperiment($id: ID!) {
    deleteExperiment(id: $id)
  }
`);
