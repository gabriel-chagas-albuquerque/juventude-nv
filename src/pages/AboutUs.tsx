import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Heart, Star, Flame, BookOpen } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { client } from '@/lib/sanityClient';
import { ABOUT_US_QUERY } from '@/lib/queries';
import type { AboutUs as AboutUsType } from '@/lib/types';

const iconMap: Record<string, LucideIcon> = {
  Users,
  Target,
  Heart,
  Star,
  Flame,
  BookOpen
};

export default function AboutUs() {
  const [content, setContent] = useState<AboutUsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.fetch<AboutUsType>(ABOUT_US_QUERY)
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="pt-32 pb-24 px-4 min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-48 bg-muted rounded-lg" />
          <div className="h-24 w-full max-w-2xl bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  // Fallback if no content exists in Sanity yet
  const displayTitle = content?.title || 'Sobre Nós';
  const displayDescription = content?.description || 'Somos um movimento focado em levar a palavra de Deus para a juventude de forma dinâmica, autêntica e relevante para os dias de hoje.';
  const displayValues = content?.values || [
    { title: 'Comunhão', description: 'Construindo relacionamentos reais baseados no amor cristão.', icon: 'Users' },
    { title: 'Propósito', description: 'Descobrindo e vivendo o chamado de Deus para nossas vidas.', icon: 'Target' },
    { title: 'Adoração', description: 'Um estilo de vida que glorifica a Deus em tudo o que fazemos.', icon: 'Heart' }
  ];

  return (
    <div className="pt-32 pb-24 px-4 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-6 leading-tight">
            {displayTitle.split(' ').map((word: string, i: number) => (
              <span key={i} className={i === displayTitle.split(' ').length - 1 ? "text-gradient-fire" : ""}>
                {word}{' '}
              </span>
            ))}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            {displayDescription}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-8 mt-16">
          {displayValues.map((value: any, index: number) => {
            const IconComponent = iconMap[value.icon] || Users;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm text-center space-y-4 hover:border-primary/30 transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-xl sm:text-2xl">{value.title}</h3>
                <p className="text-base text-muted-foreground">{value.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
