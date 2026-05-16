import { useState, useEffect } from 'react';
import { client } from '@/lib/sanityClient';
import { ENEM_QUERY } from '@/lib/queries';
import type { EnemCristao } from '@/lib/types';

export function useEnemCristao() {
  const [data, setData] = useState<EnemCristao | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await client.fetch<EnemCristao>(ENEM_QUERY);
        if (result) {
          setData(result);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}
