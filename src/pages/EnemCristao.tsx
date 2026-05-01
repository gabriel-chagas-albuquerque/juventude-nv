import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  CalendarDays, 
  Trophy, 
  Target, 
  Users, 
  Sparkles,
  Download,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { client } from '@/lib/sanityClient';
import { ENEM_QUERY } from '@/lib/queries';
import type { EnemCristao, EnemFeature } from '@/lib/types';
import { PortableText } from '@portabletext/react';

const MEDAL_COLORS = [
  'from-yellow-400 to-yellow-600', // Gold
  'from-slate-300 to-slate-500',   // Silver
  'from-amber-600 to-amber-800',   // Bronze
];

// Map string names from Sanity to Lucide Components
const ICON_MAP: Record<string, any> = {
  BookOpen,
  CalendarDays,
  Trophy,
  Target,
  Users,
  Sparkles,
  GraduationCap
};

const FALLBACK_FEATURES: EnemFeature[] = [
  {
    title: 'Estudo Bíblico',
    description: 'Incentivo ao estudo sistemático e profundo das Escrituras Sagradas.',
    icon: 'BookOpen',
  },
  {
    title: 'Prova Aplicada',
    description: 'Avaliação de conhecimentos em formato dinâmico e desafiador.',
    icon: 'Target',
  },
  {
    title: 'Comunhão',
    description: 'Um momento de reunir a juventude em torno da Palavra.',
    icon: 'Users',
  },
  {
    title: 'Premiação',
    description: 'Reconhecimento para aqueles que se destacarem na dedicação.',
    icon: 'Trophy',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function EnemCristaoPage() {
  const [data, setData] = useState<EnemCristao | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await client.fetch(ENEM_QUERY);
        if (result) {
          setData(result);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do ENEM Cristão:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const features = data?.features && data.features.length > 0 ? data.features : FALLBACK_FEATURES;

  return (
    <main className="min-h-screen bg-background pt-24">
      {/* ── Hero Section ── */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full -z-10 opacity-30 blur-[100px] pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-blue-500/20" />
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-accent/20" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-full px-4 py-1.5 text-sm text-accent font-medium mb-6">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{data?.badge || 'Iniciativa Juventude NV'}</span>
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
                className="text-3xl sm:text-7xl font-black mb-4 tracking-tighter leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                <span className="text-gradient-blue">{data?.title || 'ENEM Cristão'}</span>
              </motion.h1>

              {(data?.subtitle || !data) && (
                <motion.p
                  className="text-xl text-muted-foreground mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {data?.subtitle || 'Desafiando você a conhecer mais da Palavra de Deus.'}
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
                        timeZone: 'UTC',
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
            <div className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {data?.description ? (
                <PortableText value={data.description} />
              ) : (
                <p>
                  Uma iniciativa da Juventude NV para incentivar o estudo aprofundado da Bíblia de forma dinâmica e com premiações para os melhores.
                </p>
              )}
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, idx) => {
              const Icon = ICON_MAP[feature.icon] || BookOpen;
              return (
                <motion.div key={idx} variants={itemVariants}>
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

      {/* ── Footer CTA ── */}
      <section className="py-20 px-4 bg-accent/5">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-accent/10 mb-2">
              <Sparkles className="w-10 h-10 text-accent animate-pulse" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {data?.ctaText || 'Prepare-se para o maior desafio bíblico!'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              Não fique de fora desta jornada de aprendizado e crescimento espiritual.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-white font-bold h-14 px-10 rounded-2xl shadow-xl shadow-accent/20 transition-all hover:scale-105 active:scale-95"
                onClick={() => window.location.href = '/fale-conosco?categoria=enem-cristao'}
              >
                {data?.ctaButtonText || 'Inscreva-se Agora'}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
