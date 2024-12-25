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
    "\n  query allFeatureFlags($limit: Int, $offset: Int) {\n    allFeatureFlags(limit: $limit, offset: $offset) {\n      id\n      createdAt\n      updatedAt\n      name\n      description\n      value\n      environmentNames\n      overrideRules {\n        id\n        description\n        environmentName\n        enrollment {\n          attributes\n          proportion\n        }\n        status\n        startTimestamp\n        endTimestamp\n        ... on ExperimentReference {\n          type\n          name\n        }\n        ... on ForcedValue {\n          type\n          value\n        }\n      }\n    }\n  }\n": types.AllFeatureFlagsDocument,
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
export function graphql(source: "\n  query allFeatureFlags($limit: Int, $offset: Int) {\n    allFeatureFlags(limit: $limit, offset: $offset) {\n      id\n      createdAt\n      updatedAt\n      name\n      description\n      value\n      environmentNames\n      overrideRules {\n        id\n        description\n        environmentName\n        enrollment {\n          attributes\n          proportion\n        }\n        status\n        startTimestamp\n        endTimestamp\n        ... on ExperimentReference {\n          type\n          name\n        }\n        ... on ForcedValue {\n          type\n          value\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query allFeatureFlags($limit: Int, $offset: Int) {\n    allFeatureFlags(limit: $limit, offset: $offset) {\n      id\n      createdAt\n      updatedAt\n      name\n      description\n      value\n      environmentNames\n      overrideRules {\n        id\n        description\n        environmentName\n        enrollment {\n          attributes\n          proportion\n        }\n        status\n        startTimestamp\n        endTimestamp\n        ... on ExperimentReference {\n          type\n          name\n        }\n        ... on ForcedValue {\n          type\n          value\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;