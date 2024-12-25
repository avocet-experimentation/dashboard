/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  ClientPropValue: { input: any; output: any; }
  EnvironmentNames: { input: any; output: any; }
  FlagValueDef: { input: any; output: any; }
};

export type ClientPropDef = {
  __typename?: 'ClientPropDef';
  createdAt: Scalars['Float']['output'];
  dataType: Scalars['ClientPropValue']['output'];
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isIdentifier: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['Float']['output'];
};

export type ClientPropDefDraft = {
  dataType: Scalars['ClientPropValue']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  isIdentifier: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
};

export type Enrollment = {
  __typename?: 'Enrollment';
  attributes: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  proportion: Maybe<Scalars['Float']['output']>;
};

export type EnrollmentInput = {
  attributes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  proportion?: InputMaybe<Scalars['Float']['input']>;
};

export type Environment = {
  __typename?: 'Environment';
  createdAt: Scalars['Float']['output'];
  defaultEnabled: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  pinToLists: Scalars['Boolean']['output'];
  updatedAt: Scalars['Float']['output'];
};

export type EnvironmentDraft = {
  defaultEnabled: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  pinToLists: Scalars['Boolean']['input'];
};

export type Experiment = {
  __typename?: 'Experiment';
  createdAt: Scalars['Float']['output'];
  definedTreatments: Array<Maybe<Treatment>>;
  dependents: Array<Maybe<Metric>>;
  description: Maybe<Scalars['String']['output']>;
  endTimestamp: Maybe<Scalars['Float']['output']>;
  enrollment: Enrollment;
  environmentName: Scalars['String']['output'];
  flagIds: Array<Maybe<Scalars['String']['output']>>;
  groups: Array<Maybe<ExperimentGroup>>;
  hypothesis: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  startTimestamp: Maybe<Scalars['Float']['output']>;
  status: ExperimentStatus;
  type: Scalars['String']['output'];
  updatedAt: Scalars['Float']['output'];
};

export type ExperimentDraft = {
  definedTreatments: Array<InputMaybe<TreatmentInput>>;
  dependents: Array<InputMaybe<MetricInput>>;
  description?: InputMaybe<Scalars['String']['input']>;
  endTimestamp?: InputMaybe<Scalars['Float']['input']>;
  enrollment: EnrollmentInput;
  environmentName: Scalars['String']['input'];
  flagIds: Array<InputMaybe<Scalars['String']['input']>>;
  groups: Array<InputMaybe<ExperimentGroupInput>>;
  hypothesis?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  startTimestamp?: InputMaybe<Scalars['Float']['input']>;
  status: ExperimentStatus;
  type: Scalars['String']['input'];
};

export type ExperimentGroup = {
  __typename?: 'ExperimentGroup';
  cycles: Scalars['Float']['output'];
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  proportion: Scalars['Float']['output'];
  sequence: Array<Maybe<Scalars['String']['output']>>;
};

export type ExperimentGroupInput = {
  cycles: Scalars['Float']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  proportion: Scalars['Float']['input'];
  sequence: Array<InputMaybe<Scalars['String']['input']>>;
};

export type ExperimentReference = OverrideRule & {
  __typename?: 'ExperimentReference';
  description: Maybe<Scalars['String']['output']>;
  endTimestamp: Maybe<Scalars['Float']['output']>;
  enrollment: Enrollment;
  environmentName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  startTimestamp: Maybe<Scalars['Float']['output']>;
  status: ExperimentStatus;
  type: OverrideRuleType;
};

export const ExperimentStatus = {
  Active: 'active',
  Completed: 'completed',
  Draft: 'draft',
  Paused: 'paused'
} as const;

export type ExperimentStatus = typeof ExperimentStatus[keyof typeof ExperimentStatus];
export type FeatureFlag = {
  __typename?: 'FeatureFlag';
  createdAt: Scalars['Float']['output'];
  description: Maybe<Scalars['String']['output']>;
  environmentNames: Maybe<Scalars['EnvironmentNames']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  overrideRules: Array<OverrideRule>;
  updatedAt: Scalars['Float']['output'];
  value: Scalars['FlagValueDef']['output'];
};

export type FeatureFlagDraft = {
  description?: InputMaybe<Scalars['String']['input']>;
  environmentNames?: InputMaybe<Scalars['EnvironmentNames']['input']>;
  name: Scalars['String']['input'];
  overrideRules: Array<InputMaybe<OverrideRuleInput>>;
  value: Scalars['FlagValueDef']['input'];
};

export type FlagState = {
  __typename?: 'FlagState';
  id: Scalars['ID']['output'];
  value: Scalars['String']['output'];
};

export type FlagStateInput = {
  id: Scalars['ID']['input'];
  value: Scalars['String']['input'];
};

export type ForcedValue = OverrideRule & {
  __typename?: 'ForcedValue';
  description: Maybe<Scalars['String']['output']>;
  endTimestamp: Maybe<Scalars['Float']['output']>;
  enrollment: Enrollment;
  environmentName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  startTimestamp: Maybe<Scalars['Float']['output']>;
  status: ExperimentStatus;
  type: OverrideRuleType;
  value: Scalars['String']['output'];
};

export type Metric = {
  __typename?: 'Metric';
  fieldDataType: Maybe<Scalars['String']['output']>;
  fieldName: Maybe<Scalars['String']['output']>;
};

export type MetricInput = {
  fieldDataType?: InputMaybe<Scalars['String']['input']>;
  fieldName?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createClientPropDef: ClientPropDef;
  createEnvironment: Environment;
  createExperiment: Experiment;
  createFeatureFlag: FeatureFlag;
  createSDKConnection: SdkConnection;
  createUser: User;
  deleteClientPropDef: Maybe<Scalars['ID']['output']>;
  deleteEnvironment: Maybe<Scalars['Boolean']['output']>;
  deleteExperiment: Maybe<Scalars['Boolean']['output']>;
  deleteFeatureFlag: Maybe<Scalars['ID']['output']>;
  deleteSDKConnection: Maybe<Scalars['ID']['output']>;
  deleteUser: Maybe<Scalars['ID']['output']>;
  updateClientPropDef: Maybe<ClientPropDef>;
  updateEnvironment: Maybe<Environment>;
  updateExperiment: Maybe<Experiment>;
  updateFeatureFlag: Maybe<FeatureFlag>;
  updateSDKConnection: Maybe<SdkConnection>;
  updateUser: Maybe<User>;
};


export type MutationCreateClientPropDefArgs = {
  newEntry: ClientPropDefDraft;
};


export type MutationCreateEnvironmentArgs = {
  newEntry: EnvironmentDraft;
};


export type MutationCreateExperimentArgs = {
  newEntry: ExperimentDraft;
};


export type MutationCreateFeatureFlagArgs = {
  newEntry: FeatureFlagDraft;
};


export type MutationCreateSdkConnectionArgs = {
  newEntry: SdkConnectionDraft;
};


export type MutationCreateUserArgs = {
  newEntry: UserDraft;
};


export type MutationDeleteClientPropDefArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteEnvironmentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteExperimentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteFeatureFlagArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSdkConnectionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateClientPropDefArgs = {
  partialEntry: PartialClientPropDefWithId;
};


export type MutationUpdateEnvironmentArgs = {
  partialEntry: PartialEnvironmentWithId;
};


export type MutationUpdateExperimentArgs = {
  partialEntry: PartialExperimentWithId;
};


export type MutationUpdateFeatureFlagArgs = {
  partialEntry: PartialFeatureFlagWithStringId;
};


export type MutationUpdateSdkConnectionArgs = {
  partialEntry: PartialSdkConnectionWithId;
};


export type MutationUpdateUserArgs = {
  partialEntry: PartialUserWithId;
};

export type OverrideRule = {
  description: Maybe<Scalars['String']['output']>;
  endTimestamp: Maybe<Scalars['Float']['output']>;
  enrollment: Enrollment;
  environmentName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  startTimestamp: Maybe<Scalars['Float']['output']>;
  status: ExperimentStatus;
  type: OverrideRuleType;
};

export type OverrideRuleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  endTimestamp?: InputMaybe<Scalars['Float']['input']>;
  enrollment: EnrollmentInput;
  environmentName: Scalars['String']['input'];
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  startTimestamp?: InputMaybe<Scalars['Float']['input']>;
  status: ExperimentStatus;
  type: Scalars['String']['input'];
  value?: InputMaybe<Scalars['String']['input']>;
};

export const OverrideRuleType = {
  Experiment: 'Experiment',
  ForcedValue: 'ForcedValue'
} as const;

export type OverrideRuleType = typeof OverrideRuleType[keyof typeof OverrideRuleType];
export type OverrideRuleUnion = ExperimentReference | ForcedValue;

export type PartialClientPropDefWithId = {
  dataType?: InputMaybe<Scalars['ClientPropValue']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  isIdentifier?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type PartialEnvironment = {
  createdAt?: InputMaybe<Scalars['Float']['input']>;
  defaultEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  pinToLists?: InputMaybe<Scalars['Boolean']['input']>;
  updatedAt?: InputMaybe<Scalars['Float']['input']>;
};

export type PartialEnvironmentWithId = {
  createdAt?: InputMaybe<Scalars['Float']['input']>;
  defaultEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  pinToLists?: InputMaybe<Scalars['Boolean']['input']>;
  updatedAt?: InputMaybe<Scalars['Float']['input']>;
};

export type PartialExperimentWithId = {
  createdAt?: InputMaybe<Scalars['Float']['input']>;
  definedTreatments?: InputMaybe<Array<InputMaybe<TreatmentInput>>>;
  dependents?: InputMaybe<Array<InputMaybe<MetricInput>>>;
  description?: InputMaybe<Scalars['String']['input']>;
  endTimestamp?: InputMaybe<Scalars['Float']['input']>;
  enrollment?: InputMaybe<EnrollmentInput>;
  environmentName?: InputMaybe<Scalars['String']['input']>;
  flagIds?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  groups?: InputMaybe<Array<InputMaybe<ExperimentGroupInput>>>;
  hypothesis?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  startTimestamp?: InputMaybe<Scalars['Float']['input']>;
  status?: InputMaybe<ExperimentStatus>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Float']['input']>;
};

export type PartialFeatureFlagWithStringId = {
  createdAt?: InputMaybe<Scalars['Float']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  environmentNames?: InputMaybe<Scalars['EnvironmentNames']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  overrideRules?: InputMaybe<Array<InputMaybe<OverrideRuleInput>>>;
  updatedAt?: InputMaybe<Scalars['Float']['input']>;
  value?: InputMaybe<Scalars['FlagValueDef']['input']>;
};

export type PartialSdkConnectionWithId = {
  allowedOrigins?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  clientKeyHash?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Float']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  environmentId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Float']['input']>;
};

export type PartialUserWithId = {
  id: Scalars['ID']['input'];
  identifier?: InputMaybe<Scalars['String']['input']>;
  permissions?: InputMaybe<UserPermissionsInput>;
};

export const PermissionLevel = {
  Edit: 'edit',
  Full: 'full',
  None: 'none',
  View: 'view'
} as const;

export type PermissionLevel = typeof PermissionLevel[keyof typeof PermissionLevel];
export type Query = {
  __typename?: 'Query';
  FeatureFlag: Maybe<FeatureFlag>;
  allClientPropDefs: Array<ClientPropDef>;
  allEnvironments: Array<Environment>;
  allExperiments: Array<Experiment>;
  allFeatureFlags: Array<FeatureFlag>;
  allSDKConnections: Array<SdkConnection>;
  allUsers: Array<User>;
  clientPropDef: Maybe<ClientPropDef>;
  environment: Maybe<Environment>;
  experiment: Maybe<Experiment>;
  findMatchingEnvironments: Array<Environment>;
  sdkConnection: Maybe<SdkConnection>;
  user: Maybe<User>;
};


export type QueryFeatureFlagArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAllClientPropDefsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllEnvironmentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllExperimentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllFeatureFlagsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllSdkConnectionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAllUsersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryClientPropDefArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEnvironmentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryExperimentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFindMatchingEnvironmentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  partial?: InputMaybe<PartialEnvironment>;
};


export type QuerySdkConnectionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type SdkConnection = {
  __typename?: 'SDKConnection';
  allowedOrigins: Array<Maybe<Scalars['String']['output']>>;
  clientKeyHash: Scalars['String']['output'];
  createdAt: Scalars['Float']['output'];
  description: Maybe<Scalars['String']['output']>;
  environmentId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['Float']['output'];
};

export type SdkConnectionDraft = {
  allowedOrigins: Array<InputMaybe<Scalars['String']['input']>>;
  clientKeyHash: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  environmentId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type Treatment = {
  __typename?: 'Treatment';
  duration: Scalars['Float']['output'];
  flagStates: Array<Maybe<FlagState>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type TreatmentInput = {
  duration: Scalars['Float']['input'];
  flagStates: Array<InputMaybe<FlagStateInput>>;
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  identifier: Scalars['String']['output'];
  permissions: UserPermissions;
  updatedAt: Scalars['Float']['output'];
};

export type UserDraft = {
  identifier: Scalars['String']['input'];
  permissions: UserPermissionsInput;
};

export type UserPermissions = {
  __typename?: 'UserPermissions';
  ClientPropDef: PermissionLevel;
  Environment: PermissionLevel;
  Experiment: PermissionLevel;
  FeatureFlag: PermissionLevel;
  SDKConnection: PermissionLevel;
  User: PermissionLevel;
};

export type UserPermissionsInput = {
  ClientPropDef: PermissionLevel;
  Environment: PermissionLevel;
  Experiment: PermissionLevel;
  FeatureFlag: PermissionLevel;
  SDKConnection: PermissionLevel;
  User: PermissionLevel;
};

export type CreateEnvironmentMutationVariables = Exact<{
  newEntry: EnvironmentDraft;
}>;


export type CreateEnvironmentMutation = { __typename?: 'Mutation', createEnvironment: { __typename?: 'Environment', id: string, createdAt: number, updatedAt: number, name: string, defaultEnabled: boolean, pinToLists: boolean } };

export type AllEnvironmentsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type AllEnvironmentsQuery = { __typename?: 'Query', allEnvironments: Array<{ __typename?: 'Environment', id: string, name: string, defaultEnabled: boolean, createdAt: number, updatedAt: number, pinToLists: boolean }> };

export type FindMatchingEnvironmentsQueryVariables = Exact<{
  partial: PartialEnvironment;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type FindMatchingEnvironmentsQuery = { __typename?: 'Query', findMatchingEnvironments: Array<{ __typename?: 'Environment', id: string, name: string, defaultEnabled: boolean, createdAt: number, updatedAt: number, pinToLists: boolean }> };

export type AllFeatureFlagsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type AllFeatureFlagsQuery = { __typename?: 'Query', allFeatureFlags: Array<{ __typename?: 'FeatureFlag', id: string, createdAt: number, updatedAt: number, name: string, description: string | null, value: any, environmentNames: any | null, overrideRules: Array<{ __typename?: 'ExperimentReference', type: OverrideRuleType, name: string, id: string, description: string | null, environmentName: string, status: ExperimentStatus, startTimestamp: number | null, endTimestamp: number | null, enrollment: { __typename?: 'Enrollment', attributes: Array<string | null> | null, proportion: number | null } } | { __typename?: 'ForcedValue', type: OverrideRuleType, value: string, id: string, description: string | null, environmentName: string, status: ExperimentStatus, startTimestamp: number | null, endTimestamp: number | null, enrollment: { __typename?: 'Enrollment', attributes: Array<string | null> | null, proportion: number | null } }> }> };


export const CreateEnvironmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createEnvironment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newEntry"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EnvironmentDraft"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createEnvironment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"newEntry"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newEntry"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"defaultEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"pinToLists"}}]}}]}}]} as unknown as DocumentNode<CreateEnvironmentMutation, CreateEnvironmentMutationVariables>;
export const AllEnvironmentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allEnvironments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allEnvironments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"defaultEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"pinToLists"}}]}}]}}]} as unknown as DocumentNode<AllEnvironmentsQuery, AllEnvironmentsQueryVariables>;
export const FindMatchingEnvironmentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findMatchingEnvironments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"partial"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PartialEnvironment"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findMatchingEnvironments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"partial"},"value":{"kind":"Variable","name":{"kind":"Name","value":"partial"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"defaultEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"pinToLists"}}]}}]}}]} as unknown as DocumentNode<FindMatchingEnvironmentsQuery, FindMatchingEnvironmentsQueryVariables>;
export const AllFeatureFlagsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allFeatureFlags"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allFeatureFlags"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"environmentNames"}},{"kind":"Field","name":{"kind":"Name","value":"overrideRules"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"environmentName"}},{"kind":"Field","name":{"kind":"Name","value":"enrollment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"}},{"kind":"Field","name":{"kind":"Name","value":"proportion"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"endTimestamp"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExperimentReference"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ForcedValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AllFeatureFlagsQuery, AllFeatureFlagsQueryVariables>;