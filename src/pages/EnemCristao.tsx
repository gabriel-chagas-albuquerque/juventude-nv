import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Trophy,
  Download,
  CalendarDays,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { client } from '@/lib/sanityClient';
import { ENEM_QUERY } from '@/lib/queries';
import type { EnemCristao } from '@/lib/types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
} as const;

const MEDAL_COLORS = [
  'from-yellow-400 to-yellow-600',
  'from-gray-300 to-gray-500',
  'from-orange-400 to-orange-700',
];

const STATIC_FEATURES = [
  {
    icon: BookOpen,
    title: 'Estudo Bíblico',
    description: 'Aprofunde seu conhecimento nas Escrituras de forma estruturada e competitiva.',
  },
  {
    icon: GraduationCap,
    title: 'Prova Aplicada',
    description: 'Uma prova desafiadora sobre as passagens bíblicas previamente divulgadas no edital.',
  },
  {
    icon: Trophy,
    title: 'Premiações',
    description: 'Os melhores classificados recebem prêmios especiais preparados com carinho.',
  },
  {
    icon: Sparkles,
    title: 'Crescimento Espiritual',
    description: 'Além do prêmio, você sai com um conhecimento mais sólido da Palavra de Deus.',
  },
];

export default function EnemCristaoPage() {
  const [data, setData] = useState<EnemCristao | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch<EnemCristao>(ENEM_QUERY)
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative py-28 px-4 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(ellipse, oklch(0.68 0.18 50 / 0.4) 0%, transparent 70%)' }}
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-full px-4 py-1.5 text-sm text-accent font-medium mb-6">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Iniciativa Juventude NV</span>
            </div>
          </motion.div>

          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-14 w-3/4 mx-auto" />
              <Skeleton className="h-6 w-1/2 mx-auto" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <>
              <motion.h1
                className="text-5xl sm:text-6xl font-extrabold mb-4 tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                {data?.title ? (
                  <span className="text-gradient-blue">{data.title}</span>
                ) : (
                  <span className="text-gradient-blue">ENEM Cristão</span>
                )}
              </motion.h1>

              {data?.subtitle && (
                <motion.p
                  className="text-xl text-muted-foreground mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {data.subtitle}
                </motion.p>
              )}

              {data?.eventDate && (
                <motion.div
                  className="flex items-center justify-center gap-2 text-muted-foreground mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <CalendarDays className="w-4 h-4 text-accent" />
                  <span className="text-sm">
                    Data:{' '}
                    <span className="text-accent font-medium">
                      {new Date(data.eventDate).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </span>
                </motion.div>
              )}
            </>
          )}

          {/* Download Button */}
          {loading ? (
            <Skeleton className="h-12 w-48 mx-auto rounded-lg" />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {data?.editalUrl ? (
                <a 
                  href={`${data.editalUrl}?dl=edital-enem-cristao.pdf`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button
                    id="enem-download-edital"
                    size="lg"
                    className="bg-[#00AEEF] hover:bg-[#00AEEF]/90 text-white font-bold shadow-lg shadow-blue-500/20 px-8 transition-all hover:scale-105"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Baixar Edital (PDF)
                  </Button>
                </a>
              ) : (
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-muted/50 border border-dashed border-border text-muted-foreground font-medium animate-pulse">
                  <Download className="w-4 h-4 opacity-50" />
                  <span>Edital disponível em breve</span>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── O Que É ── */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
              O que é o <span className="text-gradient-blue">ENEM Cristão</span>?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Uma iniciativa da Juventude NV para incentivar o estudo aprofundado da Bíblia de forma dinâmica e com premiações para os melhores.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {STATIC_FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div key={feature.title} variants={itemVariants}>
                  <Card className="h-full bg-card border-border shadow-sm hover:border-accent/40 transition-all duration-300 group">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                          <Icon className="w-5 h-5 text-accent" />
                        </div>
                        <CardTitle className="text-base font-semibold group-hover:text-accent transition-colors">
                          {feature.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-base leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Premiações ── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
              <span className="text-gradient-fire">Premiações</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Os melhores classificados serão premiados. Venha participar!
            </p>
          </motion.div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card">
                  <Skeleton className="h-14 w-14 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : data?.prizes && data.prizes.length > 0 ? (
            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {data.prizes.map((prize, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <div className="flex items-center gap-4 p-5 rounded-xl border border-border/60 bg-card hover:border-primary/30 transition-all group">
                    <div
                      className={`shrink-0 w-14 h-14 rounded-full bg-gradient-to-br ${MEDAL_COLORS[index] ?? 'from-primary to-primary/60'} flex items-center justify-center shadow-lg`}
                    >
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                        {prize.position}
                      </p>
                      <p className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {prize.prize}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 border border-border/50 rounded-xl bg-card">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-primary opacity-40" />
              <p className="text-muted-foreground">As premiações serão anunciadas em breve.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="p-10 rounded-2xl border border-accent/30 bg-accent/5 glow-blue relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold mb-3">
                Pronto para o <span className="text-gradient-blue">desafio</span>?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Baixe o edital, estude a Palavra de Deus e venha mostrar seu conhecimento bíblico!
              </p>
              {data?.editalUrl ? (
                <a 
                  href={`${data.editalUrl}?dl=edital-enem-cristao.pdf`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button
                    id="enem-final-cta"
                    size="lg"
                    className="bg-[#00AEEF] hover:bg-[#00AEEF]/90 text-white font-bold px-8 transition-all hover:scale-105"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Baixar Edital Agora
                  </Button>
                </a>
              ) : (
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-background/50 border border-dashed border-accent/30 text-muted-foreground font-medium">
                  <Download className="w-4 h-4 opacity-40" />
                  Edital em breve
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
