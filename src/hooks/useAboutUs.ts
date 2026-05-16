import { useState, useEffect } from 'react';
import { client } from '@/lib/sanityClient';
import { ABOUT_US_QUERY } from '@/lib/queries';
import type { AboutUs } from '@/lib/types';

export function useAboutUs() {
  const [data, setData] = useState<AboutUs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    client.fetch<AboutUs>(ABOUT_US_QUERY)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
