import { createContext, useContext, type ReactNode } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import type { SiteSettings } from '@/lib/types';

interface SettingsContextType {
  settings: SiteSettings | null;
  loading: boolean;
  error: Error | null;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { data: settings, loading, error } = useSiteSettings();

  return (
    <SettingsContext.Provider value={{ settings, loading, error }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
