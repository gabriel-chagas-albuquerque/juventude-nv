import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MessageCircle, 
  Info, 
  ChevronRight, 
  Instagram, 
  Youtube, 
  Phone,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { client } from '@/lib/sanityClient';
import { SITE_SETTINGS_QUERY } from '@/lib/queries';
import type { SiteSettings } from '@/lib/types';

const containerVariants = {
  hidden: { opacity: 0.5 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
} as const;

const navCards = [
  {
    title: 'Sobre nós',
    path: '/sobre-nos',
    icon: Info,
    color: 'from-blue-500/20 to-blue-600/20',
    iconColor: 'text-blue-400',
    description: 'Conheça nossa história e propósito.'
  },
  {
    title: 'Programação/Eventos',
    path: '/programacao',
    icon: Calendar,
    color: 'from-orange-500/20 to-orange-600/20',
    iconColor: 'text-orange-400',
    description: 'Nossa agenda completa e próximos eventos.'
  },
  {
    title: 'Fale Conosco',
    path: '/fale-conosco',
    icon: MessageCircle,
    color: 'from-emerald-500/20 to-emerald-600/20',
    iconColor: 'text-emerald-400',
    description: 'Fale Conosco.'
  },
  {
  title: 'Enem Cristão',
    path: '/enem-cristao',
    icon: BookOpen,
    color: 'from-blue-500/20 to-blue-600/20',
    iconColor: 'text-blue-400',
    description: 'Saiba mais sobre o Enem Cristão.'
  }
];

export default function Home() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    client.fetch(SITE_SETTINGS_QUERY)
      .then(setSettings)
      .catch((err) => {
        console.error("Erro ao carregar configurações:", err);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-hidden">
      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-4">
        {/* Cinematic background */}
        <div className="absolute inset-0 z-0">
          {settings?.heroImageUrl && (
            <img
              src={settings.heroImageUrl}
              alt="Background"
              className="w-full h-full object-cover opacity-100"
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-background" />
        </div>

        <div className="relative z-10 max-w-6xl w-full mx-auto flex flex-col items-center">
          {/* Header Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center mb-6"
          >
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 sm:mb-6 text-center sm:text-left">
                <img
                  src={'./letreiro-juventude-nv.png'}
                  alt="Logo"
                  className="w-32 h-32 sm:w-48 sm:h-48 object-contain drop-shadow-xl"
                />
              <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black tracking-tighter drop-shadow-2xl leading-none">
                <span className="text-[#FF8000]">Juventude</span> <span className="text-[#00AEEF]">NV</span>
              </h1>
            </div>

            {/* Social Icons with Conditionals */}
            <div className="flex gap-4 mb-8">
              {Array.isArray(settings?.socialLinks) && settings.socialLinks.find(l => l.platform === 'instagram')?.url && (
                <a
                  href={settings.socialLinks.find(l => l.platform === 'instagram')?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-[#FF8000] hover:border-[#FF8000] transition-all duration-300 hover:scale-110"
                  title="Instagram"
                >
                  <Instagram size={24} />
                </a>
              )}
              {Array.isArray(settings?.socialLinks) && settings.socialLinks.find(l => l.platform === 'youtube')?.url && (
                <a
                  href={settings.socialLinks.find(l => l.platform === 'youtube')?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-[#FF0000] hover:border-[#FF0000] transition-all duration-300 hover:scale-110"
                  title="Youtube"
                >
                  <Youtube size={24} />
                </a>
              )}
              {(() => {
                const whatsapp = Array.isArray(settings?.socialLinks) 
                  ? settings.socialLinks.find(l => l.platform === 'whatsapp')?.url 
                  : null;
                if (!whatsapp) return null;
                return (
                  <a
                    href={whatsapp.startsWith('http') 
                      ? whatsapp 
                      : `https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-[#25D366] hover:border-[#25D366] transition-all duration-300 hover:scale-110"
                    title="Whatsapp"
                  >
                    <Phone size={24} />
                  </a>
                );
              })()}
            </div>
          </motion.div>

          {/* Quick Access Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-24"
          >
            {navCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <motion.div key={index} variants={itemVariants}>
                  <Link to={card.path} className="group block h-full">
                    <div className="relative h-full p-6 rounded-2xl border border-zinc-200 bg-zinc-100 hover:border-primary/50 transition-all duration-500 overflow-hidden shadow-xl">
                      <div className={cn(
                        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10",
                        card.color
                      )} />
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner", card.color)}>
                        <IconComponent className={cn("w-6 h-6", card.iconColor)} />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold mb-2 flex items-center gap-2 text-zinc-900">
                        {card.title}
                        <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-zinc-400" />
                      </h3>
                      <p className="text-xs md:text-sm text-zinc-600 leading-relaxed font-medium line-clamp-2">
                        {card.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Footer Text / Organization Name */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-0 right-0 text-center"
        >
          <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.4em] text-white/50">
            {settings?.organizationName || "Assembleia de Deus Novo Viver"}
          </span>
        </motion.div>
      </section>
    </div>
  );
}
