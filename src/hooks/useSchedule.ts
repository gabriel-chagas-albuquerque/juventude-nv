import { useState, useEffect } from 'react';
import { client } from '@/lib/sanityClient';
import { SCHEDULE_QUERY } from '@/lib/queries';
import type { ScheduleItem } from '@/lib/types';

const FALLBACK_SCHEDULE: ScheduleItem[] = [
  {
    _id: 'fallback-ebd',
    title: 'Escola Bíblica Dominical',
    tipoRecorrencia: 'semanal',
    diaDaSemana: '0', // Domingo
    time: '09:30',
    location: 'Sede',
    description: ''
  },
  {
    _id: 'fallback-culto-jovens',
    title: 'Culto de Jovens',
    tipoRecorrencia: 'mensal_ordinal',
    ordemMensal: '3', // 3º
    diaDaSemana: '6', // Sábado
    time: '19:30',
    location: 'Sede',
    description: 'Culto de Jovens'
  }
];

export function useSchedule() {
  const [data, setData] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    client.fetch<ScheduleItem[]>(SCHEDULE_QUERY)
      .then((res) => {
        setData(res && res.length > 0 ? res : FALLBACK_SCHEDULE);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
        setData(FALLBACK_SCHEDULE);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
