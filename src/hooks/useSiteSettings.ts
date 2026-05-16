import { useState, useEffect } from 'react';
import { client } from '@/lib/sanityClient';
import { SITE_SETTINGS_QUERY } from '@/lib/queries';
import type { SiteSettings } from '@/lib/types';

const FALLBACK_SETTINGS = {
  socialLinks: {
    instagram: 'https://www.instagram.com/ad.novoviver?igsh=emRmc2pxNG8zcmsx',
    youtube: 'https://www.youtube.com/@igrejaa.d.novoviver2670',
    whatsapp: 'https://wa.me/5585987050515'
  },
  address: 'Av. C, 525, Conjunto Ceará, Fortaleza, Ceará'
};

export function useSiteSettings() {
  const [data, setData] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    client.fetch<SiteSettings>(SITE_SETTINGS_QUERY)
      .then((res) => {
        const settings = res || { home: {} } as SiteSettings;
        if (!settings.home) settings.home = {} as any;

        // Apply fallbacks
        settings.home.socialLinks = {
          instagram: settings.home.socialLinks?.instagram || FALLBACK_SETTINGS.socialLinks.instagram,
          youtube: settings.home.socialLinks?.youtube || FALLBACK_SETTINGS.socialLinks.youtube,
          whatsapp: settings.home.socialLinks?.whatsapp || FALLBACK_SETTINGS.socialLinks.whatsapp,
        };

        if (!settings.home.contactInfo) settings.home.contactInfo = {};
        settings.home.contactInfo.address = settings.home.contactInfo.address || FALLBACK_SETTINGS.address;

        setData(settings);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
        
        // Return fallbacks even on error
        const fallbackObj = { 
          home: { 
            socialLinks: FALLBACK_SETTINGS.socialLinks,
            contactInfo: { address: FALLBACK_SETTINGS.address }
          } 
        } as SiteSettings;
        
        setData(fallbackObj);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
