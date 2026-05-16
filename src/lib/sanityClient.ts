import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION,
  useCdn: true,
});

// Standardized error logging for all Sanity fetches
const originalFetch = sanityClient.fetch.bind(sanityClient);
// @ts-ignore - Wrapping fetch with error logging
sanityClient.fetch = async (...args: any[]) => {
  try {
    return await (originalFetch as any)(...args);
  } catch (error) {
    console.error(`[Sanity Error]`, {
      query: args[0],
      params: args[1],
      message: error instanceof Error ? error.message : String(error),
      error
    });
    throw error;
  }
};

export const client = sanityClient;
