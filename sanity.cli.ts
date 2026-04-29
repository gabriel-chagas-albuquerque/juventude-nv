import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.VITE_SANITY_PROJECT_ID || '1mpxey5n',
    dataset: process.env.VITE_SANITY_DATASET || 'production'
  },
  deployment: {
    appId: 'e38w0fe4g353w85sl6jevmo8',
  }
});
