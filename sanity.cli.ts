import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    // @ts-ignore
    projectId: process.env.VITE_SANITY_PROJECT_ID as string,
    // @ts-ignore
    dataset: process.env.VITE_SANITY_DATASET as string
  },
  deployment: {
    appId: process.env.VITE_CLI_APP_ID as string,
  }
});
