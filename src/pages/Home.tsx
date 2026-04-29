import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, User, Clock, MessageCircle, CalendarDays, Church } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { client } from '@/lib/sanityClient';
import { YOUTH_UNITS_QUERY, SCHEDULE_QUERY, SITE_SETTINGS_QUERY } from '@/lib/queries';
import type { YouthUnit, ScheduleItem, SiteSettings } from '@/lib/types';

const DAY_LABELS: Record<string, string> = {
  domingo: 'Domingo',
  segunda: 'Segunda',
  terca: 'Terça',
  quarta: 'Quarta',
  quinta: 'Quinta',
  sexta: 'Sexta',
  sabado: 'Sábado',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
} as const;

export default function Home() {
  const [units, setUnits] = useState<YouthUnit[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loadingUnits, setLoadingUnits] = useState(true);
  const [loadingSchedule, setLoadingSchedule] = useState(true);

  useEffect(() => {
    client
      .fetch<YouthUnit[]>(YOUTH_UNITS_QUERY)
      .then((data) => setUnits(data))
      .finally(() => setLoadingUnits(false));

    client
      .fetch<ScheduleItem[]>(SCHEDULE_QUERY)
      .then((data) => setSchedule(data))
      .finally(() => setLoadingSchedule(false));

    client
      .fetch<SiteSettings>(SITE_SETTINGS_QUERY)
      .then((data) => setSettings(data));
  }, []);

  const sortedSchedule = [...schedule].sort((a, b) => {
    const dateA = new Date(a.eventDate || '').getTime();
    const dateB = new Date(b.eventDate || '').getTime();

    if (dateA !== dateB) {
      return dateA - dateB;
    }

    // Se a data for igual, ordena por horário
    return (a.time || '').localeCompare(b.time || '');
  });

  return (
    <div className="flex flex-col">
      {/* ── Hero Section ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Cinematic background */}
        <div className="absolute inset-0">
          <img
            src={settings?.heroImageUrl || "/src/assets/hero-new.png"}
            alt="Youth Group"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-overlay" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full px-4 py-1.5 text-sm text-primary font-bold mb-6">
              <span>🔥</span>
              <span>{settings?.organizationName || "Assembleia de Deus Novo Viver"}</span>
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-8xl font-extrabold mb-4 tracking-tighter"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            <span className="text-gradient-fire">{settings?.title?.split(' ')[0] || "Juventude"}</span>{' '}
            <span className="text-gradient-blue">{settings?.title?.split(' ').slice(1).join(' ') || "NV"}</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-2xl text-foreground/90 max-w-2xl mx-auto mb-10 leading-tight font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
          >
            {settings?.slogan || "Uma juventude em chamas pelo Evangelho. Venha fazer parte dessa geração que está transformando o mundo."}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }}
          >
            <Button
              id="hero-cta-units"
              size="lg"
              className="h-14 px-8 text-lg bg-fire-gradient hover:opacity-90 text-white font-bold glow-orange transition-all"
              onClick={() => document.getElementById('unidades')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Nossas Unidades
            </Button>
            <Link to="/formulario">
              <Button
                id="hero-cta-form"
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 hover:border-white/40 font-bold transition-all"
              >
                Fale Conosco
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center pt-2">
            <div className="w-1 h-2 bg-primary rounded-full shadow-[0_0_8px_var(--primary)]" />
          </div>
        </motion.div>
      </section>

      {/* ── Unidades Section ── */}
      <section id="unidades" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
              Nossas <span className="text-gradient-fire">Unidades</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Encontre a unidade mais próxima de você e venha nos visitar!
            </p>
          </motion.div>

          {loadingUnits ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-6 space-y-3">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : units.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <MapPin className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Nenhuma unidade cadastrada ainda.</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {units.map((unit) => (
                <motion.div key={unit._id} variants={itemVariants}>
                  <Card className="h-full border-border/60 hover:border-primary/40 transition-all duration-300 group overflow-hidden flex flex-col bg-card/50 backdrop-blur-sm">
                    {/* Imagem ou Fallback */}
                    <div className="h-40 overflow-hidden bg-muted flex items-center justify-center relative">
                      {unit.imageUrl ? (
                        <img
                          src={unit.imageUrl}
                          alt={unit.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-primary/20">
                          <Church className="w-16 h-16 mb-1" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/30">Juventude NV</span>
                        </div>
                      )}
                    </div>

                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                        {unit.name}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-4 flex-1 flex flex-col">
                      <div className="space-y-2">
                        {unit.address && (
                          <div className="flex items-start gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                            <span className="line-clamp-2">{unit.address}</span>
                          </div>
                        )}
                        {unit.leader && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="w-4 h-4 shrink-0 text-primary" />
                            <span>{unit.leader}</span>
                          </div>
                        )}
                      </div>

                      {/* Lista de Dias de Culto */}
                      <div className="pt-3 border-t border-border/50">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">
                          Dias de Culto
                        </span>
                        <div className="space-y-1.5">
                          {unit.cultDays && unit.cultDays.length > 0 ? (
                            unit.cultDays.map((cult, idx) => (
                              <div key={idx} className="flex justify-between items-center text-xs bg-primary/5 px-2 py-1.5 rounded-md border border-primary/10">
                                <span className="font-semibold text-foreground/80">{cult.day}</span>
                                <span className="text-primary font-bold">{cult.time}</span>
                              </div>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground italic">Horários em breve</span>
                          )}
                        </div>
                      </div>

                      <div className="mt-auto pt-4">
                        {unit.whatsappLink && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                            onClick={() => window.open(unit.whatsappLink, '_blank')}
                          >
                            <MessageCircle className="w-4 h-4" />
                            Entrar em Contato
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
            ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Programação Section ── */}
      <section id="programacao" className="py-24 px-4 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tighter"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Nossa <span className="text-gradient-blue">Programação</span>
            </motion.h2>
            <motion.p
              className="text-muted-foreground max-w-2xl mx-auto text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Fique por dentro de tudo o que acontece na nossa juventude.
            </motion.p>
          </motion.div>

          {loadingSchedule ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl border border-border bg-card">
                  <Skeleton className="h-14 w-14 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedSchedule.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Nenhum evento cadastrado ainda.</p>
            </div>
          ) : (
            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {sortedSchedule.map((item) => (
                <motion.div key={item._id} variants={itemVariants}>
                  <div className="flex flex-col sm:flex-row gap-4 p-6 rounded-2xl border border-border/60 bg-card hover:border-primary/40 transition-all duration-300 group hover:shadow-lg hover:shadow-primary/5">
                    {/* Date Block */}
                    <div className="shrink-0 flex sm:flex-col items-center justify-center gap-2 sm:gap-0 sm:w-20 sm:h-20 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors py-2 px-4 sm:px-0">
                      <span className="text-primary font-bold text-xl sm:text-2xl leading-none">
                        {item.eventDate ? new Date(item.eventDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit' }) : '??'}
                      </span>
                      <span className="text-primary/70 font-semibold text-[10px] sm:text-xs uppercase tracking-wider">
                        {item.eventDate 
                          ? new Date(item.eventDate + 'T00:00:00').toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '') 
                          : (DAY_LABELS[item.dayOfWeek] || '').slice(0, 3)}
                      </span>
                    </div>

                    {/* Content Block */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 text-primary font-bold text-sm bg-primary/5 px-3 py-1 rounded-full w-fit">
                          <Clock className="w-4 h-4" />
                          <span>{item.time || 'A definir'}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <div>
                            <span className="font-semibold text-foreground/90 block">
                              {item.location || 'Local a definir'}
                            </span>
                            {item.address && (
                              <span className="text-xs leading-relaxed block mt-0.5">
                                {item.address}
                              </span>
                            )}
                          </div>
                        </div>

                        {item.description && (
                          <div className="mt-3 pt-3 border-t border-border/50">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        )}
                        
                        <div className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest mt-2">
                          {DAY_LABELS[item.dayOfWeek]}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="p-10 rounded-2xl border border-primary/30 bg-primary/5 glow-orange relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-900/10 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold mb-3">
                Precisa de <span className="text-gradient-fire">oração</span>?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Nossa equipe está pronta para orar por você. Envie seu pedido de oração, pedido de visita e muito mais.
              </p>
              <Link to="/formulario">
                <Button
                  id="cta-banner-form"
                  size="lg"
                  className="bg-fire-gradient hover:opacity-90 text-white font-semibold"
                >
                  Enviar Pedido
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
