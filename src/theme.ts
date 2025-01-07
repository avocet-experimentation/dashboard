import {
  createSystem,
  defaultConfig,
  defineConfig,
  SystemConfig,
} from '@chakra-ui/react';

const config: SystemConfig = defineConfig({
  theme: {
    semanticTokens: {
      colors: {
        'avocet-bg': {
          value: {
            base: 'whitesmoke',
            _dark: '#0c142e',
          },
        },
        'avocet-dropdown-bg': {
          value: {
            base: 'whitesmoke',
            _dark: '#0c142e',
          },
        },
        'avocet-text': {
          value: {
            base: '#013856',
            _dark: 'white',
          },
        },
        'avocet-border': {
          value: {
            base: '#013856',
            _dark: 'gray',
          },
        },
        'avocet-table': {
          value: {
            _dark: '#013856',
          },
        },
        'avocet-section': {
          value: {
            base: 'white',
            _dark: '#012a40',
          },
        },
        'avocet-tag': {
          value: {
            base: 'gray',
            _dark: 'blue',
          },
        },
        'avocet-error-fg': {
          value: {
            base: '#ef4444',
            _dark: '#FFFFFF',
          },
        },
        'avocet-error-bg': {
          value: {
            base: '#fee2e2',
            _dark: '#9B1C2E',
          },
        },
        'avocet-edit-fg': {
          value: {
            base: '#efc443',
            _dark: '#FFFFFF',
          },
        },
        'avocet-edit-bg': {
          value: {
            base: '#fef7e1',
            _dark: '#9B1C2E',
          },
        },
        'avocet-dragging': {
          value: {
            base: '#e4e4e7',
            _dark: '#012a40',
          },
        },
        'avocet-hover': {
          value: {
            base: '#e4e4e7',
            _dark: '#1A4F73',
          },
        },
        'avocet-button-bg': {
          value: {
            base: 'black',
            _dark: '#012a40',
          },
        },
        'avocet-plain-button-hover-color': {
          value: {
            base: 'blue',
            _dark: '#2e90d1',
          },
        },
        'avocet-plain-button-hover-bg': {
          value: {
            base: 'whitesmoke',
            _dark: '#001c2b',
          },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
