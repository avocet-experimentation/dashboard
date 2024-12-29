/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "\n  mutation createEnvironment($newEntry: EnvironmentDraft!) {\n    createEnvironment(newEntry: $newEntry) {\n      id\n      createdAt\n      updatedAt\n      name\n      defaultEnabled\n      pinToLists\n    }\n  }\n": types.CreateEnvironmentDocument,
    "\n  query allEnvironments($limit: Int, $offset: Int) {\n    allEnvironments(limit: $limit, offset: $offset) {\n      id\n      name\n      defaultEnabled\n      createdAt\n      updatedAt\n      pinToLists\n    }\n  }\n": types.AllEnvironmentsDocument,
    "\n  query findMatchingEnvironments($partial: PartialEnvironment!, $limit: Int) {\n    findMatchingEnvironments(partial: $partial, limit: $limit) {\n      id\n      name\n      defaultEnabled\n      createdAt\n      updatedAt\n      pinToLists\n    }\n  }\n": types.FindMatchingEnvironmentsDocument,
    "\n  mutation updateEnvironment($partialEntry: PartialEnvironmentWithId!) {\n    updateEnvironment(partialEntry: $partialEntry) {\n      id\n      createdAt\n      updatedAt\n      name\n      defaultEnabled\n      pinToLists\n    }\n  }\n": types.UpdateEnvironmentDocument,
    "\n  mutation createExperiment($newEntry: ExperimentDraft!) {\n    createExperiment(newEntry: $newEntry) {\n      id\n      name\n      environmentName\n      status\n      type\n      description\n      hypothesis\n      startTimestamp\n      endTimestamp\n      enrollment {\n        attributes\n        proportion\n      }\n      groups {\n        id\n        name\n        description\n        proportion\n        cycles\n        sequence\n      }\n      definedTreatments\n      dependents {\n        fieldName\n        fieldDataType\n      }\n      flagIds\n      createdAt\n      updatedAt\n    }\n  }\n": types.CreateExperimentDocument,
    "\n  query experiment($id: ID!) {\n    experiment(id: $id) {\n      id\n      name\n      environmentName\n      status\n      type\n      description\n      hypothesis\n      startTimestamp\n      endTimestamp\n      enrollment {\n        attributes\n        proportion\n      }\n      groups {\n        id\n        name\n        description\n        proportion\n        cycles\n        sequence\n      }\n      definedTreatments\n      dependents {\n        fieldName\n        fieldDataType\n      }\n      flagIds\n      createdAt\n      updatedAt\n    }\n  }\n": types.ExperimentDocument,
    "\n  query allExperiments($limit: Int, $offset: Int) {\n    allExperiments(limit: $limit, offset: $offset) {\n      id\n      createdAt\n      updatedAt\n      name\n      environmentName\n      status\n    }\n  }\n": types.AllExperimentsDocument,
    "\n  mutation updateExperiment($partialEntry: PartialExperimentWithId!) {\n    updateExperiment(partialEntry: $partialEntry) {\n      id\n      name\n      environmentName\n      status\n      type\n      description\n      hypothesis\n      startTimestamp\n      endTimestamp\n      enrollment {\n        attributes\n        proportion\n      }\n      groups {\n        id\n        name\n        description\n        proportion\n        cycles\n        sequence\n      }\n      definedTreatments\n      dependents {\n        fieldName\n        fieldDataType\n      }\n      flagIds\n    }\n  }\n": types.UpdateExperimentDocument,
    "\n  mutation deleteExperiment($id: ID!) {\n    deleteExperiment(id: $id)\n  }\n": types.DeleteExperimentDocument,
    "\n  mutation createFeatureFlag($newEntry: FeatureFlagDraft!) {\n    createFeatureFlag(newEntry: $newEntry) {\n      id\n      createdAt\n      updatedAt\n      name\n      description\n      value\n      environmentNames\n      overrideRules {\n        id\n        description\n        environmentName\n        enrollment {\n          attributes\n          proportion\n        }\n        status\n        startTimestamp\n        endTimestamp\n        ... on ExperimentReference {\n          type\n          name\n        }\n        ... on ForcedValue {\n          type\n          value\n        }\n      }\n    }\n  }\n": types.CreateFeatureFlagDocument,
    "\n  query featureFlag($id: ID!) {\n    featureFlag(id: $id) {\n      id\n      createdAt\n      updatedAt\n      name\n      description\n      value\n      environmentNames\n      overrideRules {\n        id\n        description\n        environmentName\n        enrollment {\n          attributes\n          proportion\n        }\n        status\n        startTimestamp\n        endTimestamp\n        ... on ExperimentReference {\n          type\n          name\n        }\n        ... on ForcedValue {\n          type\n          value\n        }\n      }\n    }\n  }\n": types.FeatureFlagDocument,
    "\n  query allFeatureFlags($limit: Int, $offset: Int) {\n    allFeatureFlags(limit: $limit, offset: $offset) {\n      id\n      createdAt\n      updatedAt\n      name\n      description\n      value\n      environmentNames\n      overrideRules {\n        id\n        description\n        environmentName\n        enrollment {\n          attributes\n          proportion\n        }\n        status\n        startTimestamp\n        endTimestamp\n        ... on ExperimentReference {\n          type\n          name\n        }\n        ... on ForcedValue {\n          type\n          value\n        }\n      }\n    }\n  }\n": types.AllFeatureFlagsDocument,
    "\n  mutation updateFeatureFlag($partialEntry: PartialFeatureFlagWithId!) {\n    updateFeatureFlag(partialEntry: $partialEntry) {\n      id\n      createdAt\n      updatedAt\n      name\n      description\n      value\n      environmentNames\n      overrideRules {\n        id\n        description\n        environmentName\n        enrollment {\n          attributes\n          proportion\n        }\n        status\n        startTimestamp\n        endTimestamp\n        ... on ExperimentReference {\n          type\n          name\n        }\n        ... on ForcedValue {\n          type\n          value\n        }\n      }\n    }\n  }\n": types.UpdateFeatureFlagDocument,
    "\n  mutation deleteFeatureFlag($id: ID!) {\n    deleteFeatureFlag(id: $id)\n  }\n": types.DeleteFeatureFlagDocument,
    "\n  mutation createSDKConnection($newEntry: SDKConnectionDraft!) {\n    createSDKConnection(newEntry: $newEntry) {\n      id\n      name\n      allowedOrigins\n      clientKeyHash\n      description\n      environmentId\n      updatedAt\n      createdAt\n    }\n  }\n": types.CreateSdkConnectionDocument,
    "\n  query allSDKConnections($limit: Int, $offset: Int) {\n    allSDKConnections(limit: $limit, offset: $offset) {\n      id\n      name\n      allowedOrigins\n      clientKeyHash\n      description\n      environmentId\n      updatedAt\n      createdAt\n    }\n  }\n": types.AllSdkConnectionsDocument,
    "\n  mutation updateSDKConnection($partialEntry: PartialSDKConnectionWithId!) {\n    updateSDKConnection(partialEntry: $partialEntry) {\n      id\n      name\n      allowedOrigins\n      clientKeyHash\n      description\n      environmentId\n      updatedAt\n      createdAt\n    }\n  }\n": types.UpdateSdkConnectionDocument,
    "\n  mutation deleteSDKConnection($id: ID!) {\n    deleteSDKConnection(id: $id)\n  }\n": types.DeleteSdkConnectionDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createEnvironment($newEntry: EnvironmentDraft!) {\n    createEnvironment(newEntry: $newEntry) {\n      id\n      createdAt\n      updatedAt\n      name\n      defaultEnabled\n      pinToLists\n    }\n  }\n"): (typeof documents)["\n  mutation createEnvironment($newEntry: EnvironmentDraft!) {\n    createEnvironment(newEntry: $newEntry) {\n      id\n      createdAt\n      updatedAt\n      name\n      defaultEnabled\n      pinToLists\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query allEnvironments($limit: Int, $offset: Int) {\n    allEnvironments(limit: $limit, offset: $offset) {\n      id\n      name\n      defaultEnabled\n      createdAt\n      updatedAt\n      pinToLists\n    }\n  }\n"): (typeof documents)["\n  query allEnvironments($limit: Int, $offset: Int) {\n    allEnvironments(limit: $limit, offset: $offset) {\n      id\n      name\n      defaultEnabled\n      createdAt\n      updatedAt\n      pinToLists\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query findMatchingEnvironments($partial: PartialEnvironment!, $limit: Int) {\n    findMatchingEnvironments(partial: $partial, limit: $limit) {\n      id\n      name\n      defaultEnabled\n      createdAt\n      updatedAt\n      pinToLists\n    }\n  }\n"): (typeof documents)["\n  query findMatchingEnvironments($partial: PartialEnvironment!, $limit: Int) {\n    findMatchingEnvironments(partial: $partial, limit: $limit) {\n      id\n      name\n      defaultEnabled\n      createdAt\n      updatedAt\n      pinToLists\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateEnvironment($partialEntry: PartialEnvironmentWithId!) {\n    updateEnvironment(partialEntry: $partialEntry) {\n      id\n      createdAt\n      updatedAt\n      name\n      defaultEnabled\n      pinToLists\n    }\n  }\n"): (typeof documents)["\n  mutation updateEnvironment($partialEntry: PartialEnvironmentWithId!) {\n    updateEnvironment(partialEntry: $partialEntry) {\n      id\n      createdAt\n      updatedAt\n      name\n      defaultEnabled\n      pinToLists\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createExperiment($newEntry: ExperimentDraft!) {\n    createExperiment(newEntry: $newEntry) {\n      id\n      name\n      environmentName\n      status\n      type\n      description\n      hypothesis\n      startTimestamp\n      endTimestamp\n      enrollment {\n        attributes\n        proportion\n      }\n      groups {\n        id\n        name\n        description\n        proportion\n        cycles\n        sequence\n      }\n      definedTreatments\n      dependents {\n        fieldName\n        fieldDataType\n      }\n      flagIds\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation createExperiment($newEntry: ExperimentDraft!) {\n    createExperiment(newEntry: $newEntry) {\n      id\n      name\n      environmentName\n      status\n      type\n      description\n      hypothesis\n      startTimestamp\n      endTimestamp\n      enrollment {\n        attributes\n        proportion\n      }\n      groups {\n        id\n        name\n        description\n        proportion\n        cycles\n        sequence\n      }\n      definedTreatments\n      dependents {\n        fieldName\n        fieldDataType\n      }\n      flagIds\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query experiment($id: ID!) {\n    experiment(id: $id) {\n      id\n      name\n      environmentName\n      status\n      type\n      description\n      hypothesis\n      startTimestamp\n      endTimestamp\n      enrollment {\n        attributes\n        proportion\n      }\n      groups {\n        id\n        name\n        description\n        proportion\n        cycles\n        sequence\n      }\n      definedTreatments\n      dependents {\n        fieldName\n        fieldDataType\n      }\n      flagIds\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query experiment($id: ID!) {\n    experiment(id: $id) {\n      id\n      name\n      environmentName\n      status\n      type\n      description\n      hypothesis\n      startTimestamp\n      endTimestamp\n      enrollment {\n        attributes\n        proportion\n      }\n      groups {\n        id\n        name\n        description\n        proportion\n        cycles\n        sequence\n      }\n      definedTreatments\n      dependents {\n        fieldName\n        fieldDataType\n      }\n      flagIds\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query allExperiments($limit: Int, $offset: Int) {\n    allExperiments(limit: $limit, offset: $offset) {\n      id\n      createdAt\n      updatedAt\n      name\n      environmentName\n      status\n    }\n  }\n"): (typeof documents)["\n  query allExperiments($limit: Int, $offset: Int) {\n    allExperiments(limit: $limit, offset: $offset) {\n      id\n      createdAt\n      updatedAt\n      name\n      environmentName\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateExperiment($partialEntry: PartialExperimentWithId!) {\n    updateExperiment(partialEntry: $partialEntry) {\n      id\n      name\n      environmentName\n      status\n      type\n      description\n      hypothesis\n      startTimestamp\n      endTimestamp\n      enrollment {\n        attributes\n        proportion\n      }\n      groups {\n        id\n        name\n        description\n        proportion\n        cycles\n        sequence\n      }\n      definedTreatments\n      dependents {\n        fieldName\n        fieldDataType\n      }\n      flagIds\n    }\n  }\n"): (typeof documents)["\n  mutation updateExperiment($partialEntry: PartialExperimentWithId!) {\n    updateExperiment(partialEntry: $partialEntry) {\n      id\n      name\n      environmentName\n      status\n      type\n      description\n      hypothesis\n      startTimestamp\n      endTimestamp\n      enrollment {\n        attributes\n        proportion\n      }\n      groups {\n        id\n        name\n        description\n        proportion\n        cycles\n        sequence\n      }\n      definedTreatments\n      dependents {\n        fieldName\n        fieldDataType\n      }\n      flagIds\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteExperiment($id: ID!) {\n    deleteExperiment(id: $id)\n  }\n"): (typeof documents)["\n  mutation deleteExperiment($id: ID!) {\n    deleteExperiment(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createFeatureFlag($newEntry: FeatureFlagDraft!) {\n    createFeatureFlag(newEntry: $newEntry) {\n      id\n      createdAt\n      updatedAt\n      name\n      description\n      value\n      environmentNames\n      overrideRules {\n        id\n        description\n        environmentName\n        enrollment {\n          attributes\n          proportion\n        }\n        status\n        startTimestamp\n        endTimestamp\n        ... on ExperimentReference {\n          type\n          name\n        }\n        ... on ForcedValue {\n          type\n          value\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation createFeatureFlag($newEntry: FeatureFlagDraft!) {\n    createFeatureFlag(newEntry: $newEntry) {\n      id\n      createdAt\n      updatedAt\n      name\n      description\n      value\n      environmentNames\n      overrideRules {\n        id\n        description\n        environmentName\n        enrollment {\n          attributes\n          proportion\n        }\n        status\n        startTimestamp\n        endTimestamp\n        ... on ExperimentReference {\n          type\n          name\n        }\n        ... on ForcedValue {\n          type\n          value\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query featureFlag($id: ID!) {\n    featureFlag(id: $id) {\n      id\n      createdAt\n      updatedAt\n      name\n      description\n      value\n      environmentNames\n      overrideRules {\n        id\n        description\n        environmentName\n        enrollment {\n          attributes\n          proportion\n        }\n        status\n        startTimestamp\n        endTimestamp\n        ... on ExperimentReference {\n          type\n          name\n        }\n        ... on ForcedValue {\n          type\n          value\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query featureFlag($id: ID!) {\n    featureFlag(id: $id) {\n      id\n      createdAt\n      updatedAt\n      name\n      description\n      value\n      environmentNames\n      overrideRules {\n        id\n        description\n        environmentName\n        enrollment {\n          attributes\n          proportion\n        }\n        status\n        startTimestamp\n        endTimestamp\n        ... on ExperimentReference {\n          type\n          name\n        }\n        ... on ForcedValue {\n          type\n          value\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query allFeatureFlags($limit: Int, $offset: Int) {\n    allFeatureFlags(limit: $limit, offset: $offset) {\n      id\n      createdAt\n      updatedAt\n      name\n      description\n      value\n      environmentNames\n      overrideRules {\n        id\n        description\n        environmentName\n        enrollment {\n          attributes\n          proportion\n        }\n        status\n        startTimestamp\n        endTimestamp\n        ... on ExperimentReference {\n          type\n          name\n        }\n        ... on ForcedValue {\n          type\n          value\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query allFeatureFlags($limit: Int, $offset: Int) {\n    allFeatureFlags(limit: $limit, offset: $offset) {\n      id\n      createdAt\n      updatedAt\n      name\n      description\n      value\n      environmentNames\n      overrideRules {\n        id\n        description\n        environmentName\n        enrollment {\n          attributes\n          proportion\n        }\n        status\n        startTimestamp\n        endTimestamp\n        ... on ExperimentReference {\n          type\n          name\n        }\n        ... on ForcedValue {\n          type\n          value\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateFeatureFlag($partialEntry: PartialFeatureFlagWithId!) {\n    updateFeatureFlag(partialEntry: $partialEntry) {\n      id\n      createdAt\n      updatedAt\n      name\n      description\n      value\n      environmentNames\n      overrideRules {\n        id\n        description\n        environmentName\n        enrollment {\n          attributes\n          proportion\n        }\n        status\n        startTimestamp\n        endTimestamp\n        ... on ExperimentReference {\n          type\n          name\n        }\n        ... on ForcedValue {\n          type\n          value\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation updateFeatureFlag($partialEntry: PartialFeatureFlagWithId!) {\n    updateFeatureFlag(partialEntry: $partialEntry) {\n      id\n      createdAt\n      updatedAt\n      name\n      description\n      value\n      environmentNames\n      overrideRules {\n        id\n        description\n        environmentName\n        enrollment {\n          attributes\n          proportion\n        }\n        status\n        startTimestamp\n        endTimestamp\n        ... on ExperimentReference {\n          type\n          name\n        }\n        ... on ForcedValue {\n          type\n          value\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteFeatureFlag($id: ID!) {\n    deleteFeatureFlag(id: $id)\n  }\n"): (typeof documents)["\n  mutation deleteFeatureFlag($id: ID!) {\n    deleteFeatureFlag(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createSDKConnection($newEntry: SDKConnectionDraft!) {\n    createSDKConnection(newEntry: $newEntry) {\n      id\n      name\n      allowedOrigins\n      clientKeyHash\n      description\n      environmentId\n      updatedAt\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  mutation createSDKConnection($newEntry: SDKConnectionDraft!) {\n    createSDKConnection(newEntry: $newEntry) {\n      id\n      name\n      allowedOrigins\n      clientKeyHash\n      description\n      environmentId\n      updatedAt\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query allSDKConnections($limit: Int, $offset: Int) {\n    allSDKConnections(limit: $limit, offset: $offset) {\n      id\n      name\n      allowedOrigins\n      clientKeyHash\n      description\n      environmentId\n      updatedAt\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query allSDKConnections($limit: Int, $offset: Int) {\n    allSDKConnections(limit: $limit, offset: $offset) {\n      id\n      name\n      allowedOrigins\n      clientKeyHash\n      description\n      environmentId\n      updatedAt\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateSDKConnection($partialEntry: PartialSDKConnectionWithId!) {\n    updateSDKConnection(partialEntry: $partialEntry) {\n      id\n      name\n      allowedOrigins\n      clientKeyHash\n      description\n      environmentId\n      updatedAt\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  mutation updateSDKConnection($partialEntry: PartialSDKConnectionWithId!) {\n    updateSDKConnection(partialEntry: $partialEntry) {\n      id\n      name\n      allowedOrigins\n      clientKeyHash\n      description\n      environmentId\n      updatedAt\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteSDKConnection($id: ID!) {\n    deleteSDKConnection(id: $id)\n  }\n"): (typeof documents)["\n  mutation deleteSDKConnection($id: ID!) {\n    deleteSDKConnection(id: $id)\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;