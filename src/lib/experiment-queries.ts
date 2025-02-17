import { graphql } from '#/graphql';

export const CREATE_EXPERIMENT = graphql(`
  mutation createExperiment($newEntry: ExperimentDraft!) {
    createExperiment(newEntry: $newEntry) {
      id
      createdAt
      updatedAt
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
      definedTreatments
      dependents {
        fieldName
        type
      }
      hypotheses {
        id
        dependentName
        analysis
        compareValue
        compareOperator
        baseConditionRef
        testConditionRef
      }
      flagIds
    }
  }
`);

export const EXPERIMENT = graphql(`
  query experiment($id: ID!) {
    experiment(id: $id) {
      id
      createdAt
      updatedAt
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
      definedTreatments
      dependents {
        fieldName
        type
      }
      hypotheses {
        id
        dependentName
        analysis
        compareValue
        compareOperator
        baseConditionRef
        testConditionRef
      }
      flagIds
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
  mutation updateExperiment($partialEntry: PartialExperimentWithId!) {
    updateExperiment(partialEntry: $partialEntry) {
      id
      createdAt
      updatedAt
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
      definedTreatments
      dependents {
        fieldName
        type
      }
      hypotheses {
        id
        dependentName
        analysis
        compareValue
        compareOperator
        baseConditionRef
        testConditionRef
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

export const START_EXPERIMENT = graphql(`
  mutation startExperiment($id: ID!) {
    startExperiment(id: $id)
  }
`);

export const PAUSE_EXPERIMENT = graphql(`
  mutation pauseExperiment($id: ID!) {
    pauseExperiment(id: $id)
  }
`);

export const COMPLETE_EXPERIMENT = graphql(`
  mutation completeExperiment($id: ID!) {
    completeExperiment(id: $id)
  }
`);
