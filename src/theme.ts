import { createContext, createSystem, defaultBaseConfig, defaultConfig, defineConfig, SystemConfig, SystemContext } from "@chakra-ui/react"

const config: SystemConfig = defineConfig({
  theme: {
    semanticTokens: {
      colors: {
        "avocet-bg": {
          value: {
            base: 'whitesmoke',
            _dark: '#0c142e',
          }
        },
        "avocet-hover": {
          value: {
            base: '#e4e4e7',
            _dark: '#27272a',
          }
        },
        "avocet-text": {
          value: {
            base: '#013856',
            _dark: 'white',
          }
        },
        "avocet-border": {
          value: {
            base: '#013856',
            _dark: 'gray',
          }
        }
      }
    }
  }  
})

export const system = createSystem(defaultConfig, config)
