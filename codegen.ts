import type { CodegenConfig } from '@graphql-codegen/cli';
import { loadEnv } from 'vite';

const env = loadEnv(process.cwd(), '');

const config: CodegenConfig = {
  config: {
    avoidOptionals: {
      field: true,
      object: false,
      inputValue: false,
    },
    enumsAsConst: true,
  },
  schema: env.VITE_GRAPHQL_SERVICE_URL,
  documents: ['src/**/*.tsx', 'src/**/*.ts', '!src/graphql/**/*'],
  ignoreNoDocuments: true,
  generates: {
    './src/graphql/': {
      preset: 'client',
    },
    './schema.graphql': {
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true,
      },
    },
  },
};

export default config;
