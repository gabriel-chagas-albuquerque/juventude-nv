import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { schemaTypes } from './src/sanity/schema';

export default defineConfig({
  name: 'default',
  title: 'Juventude NV Admin',

  projectId: import.meta.env.VITE_SANITY_PROJECT_ID!,
  dataset: import.meta.env.VITE_SANITY_DATASET!,

  plugins: [deskTool()],

  schema: {
    types: schemaTypes,
  },
});
