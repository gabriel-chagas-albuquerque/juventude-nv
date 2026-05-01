import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { schemaTypes } from './src/sanity/schema';

export default defineConfig({
  name: 'default',
  title: 'Juventude NV Admin',

  projectId: process.env.VITE_SANITY_PROJECT_ID as string,
  dataset: process.env.VITE_SANITY_DATASET as string,

  plugins: [deskTool()],

  schema: {
    types: schemaTypes,
  },
});
