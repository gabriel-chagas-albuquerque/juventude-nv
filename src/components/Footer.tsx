import { Link } from 'react-router-dom';
import { Tv, Share2 } from 'lucide-react';
import { client } from '@/lib/sanityClient';
import { SITE_SETTINGS_QUERY } from '@/lib/queries';
import type { SiteSettings } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    client.fetch<SiteSettings>(SITE_SETTINGS_QUERY).then(setSettings);
  }, []);

  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/20">
                <img src={settings?.logoUrl || "/src/assets/logo.png"} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                <span className="text-foreground">{settings?.title?.split(' ')[0] || "Juventude"}</span>{' '}
                <span className="text-gradient-blue">{settings?.title?.split(' ').slice(1).join(' ') || "NV"}</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {settings?.footerText || "Juventude da Igreja Assembleia de Deus Novo Viver. Transformando vidas pelo poder de Cristo e impactando gerações."}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-4">Navegação</h3>
            <ul className="space-y-2">
              {[
                { label: 'Início', to: '/' },
                { label: 'Formulário', to: '/formulario' },
                { label: 'ENEM Cristão', to: '/enem-cristao' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-4">Redes Sociais</h3>
            <div className="flex gap-3">
              {settings?.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-200"
                >
                  <Share2 className="w-4 h-4" />
                </a>
              )}
              {settings?.socialLinks?.youtube && (
                <a
                  href={settings.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-200"
                >
                  <Tv className="w-4 h-4" />
                </a>
              )}
              {!settings?.socialLinks?.instagram && !settings?.socialLinks?.youtube && (
                <p className="text-xs text-muted-foreground italic">Redes sociais em breve</p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-6 text-center">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} {settings?.title || "Juventude NV"} — {settings?.organizationName || "Assembleia de Deus Novo Viver"}
          </p>
        </div>
      </div>
    </footer>
  );
}
