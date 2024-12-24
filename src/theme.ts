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
            base: 'gray.100',
            _dark: 'gray.100',
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
            _dark: 'white',
          }
        }
      }
    }
  }  
})

export const system = createSystem(defaultConfig, config)
