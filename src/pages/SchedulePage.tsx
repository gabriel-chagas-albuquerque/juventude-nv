import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, MapPin, Clock, Sparkles, ChevronRight } from 'lucide-react';
import { client } from '@/lib/sanityClient';
import { SCHEDULE_QUERY } from '@/lib/queries';
import type { ScheduleItem } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const DAYS = [
  { id: '0', label: 'Domingo' },
  { id: '1', label: 'Segunda' },
  { id: '2', label: 'Terça' },
  { id: '3', label: 'Quarta' },
  { id: '4', label: 'Quinta' },
  { id: '5', label: 'Sexta' },
  { id: '6', label: 'Sábado' },
];

const ORDINAL_LABELS: Record<string, string> = {
  '1': '1º',
  '2': '2º',
  '3': '3º',
  '4': '4º',
  'last': 'Último',
};

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>(new Date().getDay().toString());

  useEffect(() => {
    client.fetch(SCHEDULE_QUERY)
      .then((data) => {
        setSchedule(data);
        setLoading(false);
      })
      .catch(() => {});
  }, []);

  // Filter events for the active weekday
  const dailyEvents = schedule.filter(item => 
    (item.tipoRecorrencia === 'semanal' || item.tipoRecorrencia === 'mensal_ordinal') && 
    item.diaDaSemana === activeTab
  ).sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  // Filter special events (fixed day monthly or one-off)
  const specialEvents = schedule.filter(item => 
    item.tipoRecorrencia === 'mensal_dia' || item.tipoRecorrencia === 'unico'
  ).sort((a, b) => {
    const dateA = a.dataFixa || '';
    const dateB = b.dataFixa || '';
    return dateA.localeCompare(dateB);
  });

  const getRecurrenceTag = (item: ScheduleItem) => {
    if (item.tipoRecorrencia === 'mensal_ordinal') {
      return `${ORDINAL_LABELS[item.ordemMensal || ''] || ''} ${DAYS.find(d => d.id === item.diaDaSemana)?.label}`;
    }
    if (item.tipoRecorrencia === 'mensal_dia') {
      return `Todo dia ${item.dataFixa ? new Date(item.dataFixa).getUTCDate() : ''}`;
    }
    if (item.tipoRecorrencia === 'unico') {
      return item.dataFixa ? new Date(item.dataFixa).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'Data única';
    }
    return 'Semanal';
  };

  return (
    <div className="pt-32 pb-24 px-4 min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl sm:text-6xl font-black mb-6 tracking-tight leading-tight">
            Programação <span className="text-[#FF8000]">& Eventos</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Nossa programação fixa e eventos especiais em um só lugar.
          </p>
        </motion.div>

        {/* Day Selector Tabs */}
        <div className="flex overflow-x-auto pb-4 mb-8 no-scrollbar gap-2 sm:justify-center">
          {DAYS.map((day) => (
            <button
              key={day.id}
              onClick={() => setActiveTab(day.id)}
              className={cn(
                "px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap border-2",
                activeTab === day.id 
                  ? "bg-[#FF8000] border-[#FF8000] text-white shadow-lg scale-105" 
                  : "bg-card border-border text-muted-foreground hover:border-primary/30"
              )}
            >
              {day.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Daily Content */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
              <CalendarDays className="text-[#FF8000]" />
              Atividades de {DAYS.find(d => d.id === activeTab)?.label}
            </h2>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="loading" className="space-y-4">
                  {[1, 2].map(i => <Skeleton key={i} className="h-32 w-full rounded-3xl" />)}
                </motion.div>
              ) : dailyEvents.length === 0 ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 text-center bg-card/50 border-2 border-dashed border-border rounded-3xl"
                >
                  <p className="text-muted-foreground">Nenhuma atividade fixa para este dia.</p>
                </motion.div>
              ) : (
                <motion.div 
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {dailyEvents.map((item) => (
                    <div 
                      key={item._id}
                      className="group bg-card border border-border rounded-3xl p-6 hover:shadow-xl transition-all hover:border-primary/20"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-2">
                          <span className="inline-block px-3 py-1 rounded-full bg-secondary text-[10px] font-bold uppercase tracking-wider text-secondary-foreground">
                            {getRecurrenceTag(item)}
                          </span>
                          <h3 className="text-xl font-bold group-hover:text-[#FF8000] transition-colors">
                            {item.title}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-[#FF8000]" />
                              <span className="font-semibold">{item.time}</span>
                            </div>
                            {item.location && (
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-[#00AEEF]" />
                                <span>{item.location}</span>
                              </div>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-base text-muted-foreground leading-relaxed pt-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF8000]/10 text-[#FF8000] opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight />
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar: Specials/Monthly */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="text-[#00AEEF]" />
              Eventos Especiais
            </h2>
            
            <div className="space-y-4">
              {loading ? (
                [1, 2].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)
              ) : specialEvents.length === 0 ? (
                <div className="p-6 rounded-2xl bg-secondary/20 border border-dashed text-center">
                  <p className="text-xs text-muted-foreground">Sem eventos especiais no radar.</p>
                </div>
              ) : (
                specialEvents.map((event) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-2xl bg-gradient-to-br from-card to-secondary/10 border border-border hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-xl bg-[#00AEEF]/10 flex items-center justify-center text-[#00AEEF] font-bold text-xs text-center leading-none">
                        {event.dataFixa ? (
                          <>
                            {new Date(event.dataFixa).getUTCDate()}<br/>
                            <span className="text-[8px] opacity-60">
                              {new Date(event.dataFixa).toLocaleDateString('pt-BR', { month: 'short', timeZone: 'UTC' }).toUpperCase()}
                            </span>
                          </>
                        ) : 'M'}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm line-clamp-1">{event.title}</h4>
                        <span className="text-[10px] text-[#00AEEF] font-bold uppercase tracking-wider">
                          {getRecurrenceTag(event)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <Clock className="w-3 h-3" /> {event.time}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
