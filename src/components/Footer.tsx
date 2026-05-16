import { Link } from 'react-router-dom';
import { Instagram, Youtube, Phone, MapPin } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center md:items-start space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/20">
                <img 
                  src={settings?.home?.logoUrl || "/logo juventude-nv.png"} 
                  alt="Logo" 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== "/logo juventude-nv.png") {
                      target.src = "/logo juventude-nv.png";
                    }
                  }}
                />
              </div>
              <span className="font-bold text-xl tracking-tight">
                <span className="text-foreground">{settings?.home?.title?.split(' ')[0] || "Juventude"}</span>{' '}
                <span className="text-gradient-blue">{settings?.home?.title?.split(' ').slice(1).join(' ') || "NV"}</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs text-center md:text-left">
              {settings?.home?.footerText || "Juventude da Igreja Assembleia de Deus Novo Viver. Transformando vidas pelo poder de Cristo e impactando gerações."}
            </p>
            {settings?.home?.contactInfo?.address && (
              <div className="flex items-start gap-3 text-muted-foreground text-sm group">
                <MapPin className="w-5 h-5 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                <span className="leading-relaxed">
                  {settings.home.contactInfo.address}
                </span>
              </div>
            )}
          </div>

          {/* Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-sm text-foreground mb-4">Navegação</h3>
            <ul className="space-y-2 text-center md:text-left">
              {[
                { label: 'Início', to: '/' },
                { label: 'Sobre nós', to: '/sobre-nos' },
                { label: 'Programação/Eventos', to: '/programacao' },
                { label: 'Fale Conosco', to: '/fale-conosco' },
                { label: 'ENEM Cristão', to: '/enem-cristao' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-muted-foreground hover:text-primary text-base transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-sm text-foreground mb-4">Redes Sociais</h3>
            <div className="flex gap-3 justify-center md:justify-start">
              {settings?.home?.socialLinks?.instagram && (
                <a
                  href={settings.home.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-[#FF8000] hover:border-[#FF8000] transition-all duration-200 hover:scale-110"
                  title="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings?.home?.socialLinks?.youtube && (
                <a
                  href={settings.home.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-[#FF0000] hover:border-[#FF0000] transition-all duration-200 hover:scale-110"
                  title="Youtube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}
              {settings?.home?.socialLinks?.whatsapp && (
                <a
                  href={settings.home.socialLinks.whatsapp.startsWith('http') 
                    ? settings.home.socialLinks.whatsapp 
                    : `https://wa.me/${settings.home.socialLinks.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-[#25D366] hover:border-[#25D366] transition-all duration-200 hover:scale-110"
                  title="Whatsapp"
                >
                  <Phone className="w-5 h-5" />
                </a>
              )}
              {!settings?.home?.socialLinks?.instagram && !settings?.home?.socialLinks?.youtube && !settings?.home?.socialLinks?.whatsapp && (
                <p className="text-xs text-muted-foreground italic">Redes sociais em breve</p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-6 text-center">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} {settings?.home?.title || "Juventude NV"} — {settings?.home?.organizationName || "Assembleia de Deus Novo Viver"}
          </p>
        </div>
      </div>
    </footer>
  );
}
