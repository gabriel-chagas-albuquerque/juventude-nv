import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { schemaTypes } from './src/sanity/schema';

export default defineConfig({
  name: 'default',
  title: 'Juventude NV Admin',

  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || '1mpxey5n',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',

  plugins: [deskTool()],

  schema: {
    types: schemaTypes,
  },
});
