// Types for Sanity data
export interface ScheduleItem {
  _id: string;
  title: string;
  tipoRecorrencia?: 'semanal' | 'mensal_dia' | 'mensal_ordinal' | 'unico';
  diaDaSemana?: string;
  ordemMensal?: string;
  dataFixa?: string;
  time?: string;
  description?: string;
  location?: string;
  address?: string;
}


export interface AboutUsValue {
  title: string;
  description: string;
  icon: string;
}

export interface AboutUs {
  _id: string;
  title: string;
  description: string;
  values: AboutUsValue[];
}

export interface FormCategory {
  _id: string;
  label: string;
  value: string;
  description?: string;
}

export interface FormQuestion {
  _id: string;
  question: string;
  fieldName: string;
  fieldType: 'text' | 'textarea' | 'email' | 'tel';
  placeholder?: string;
  required: boolean;
}

export interface Prize {
  position: string;
  prize: string;
}

export interface EnemCristao {
  _id: string;
  title: string;
  subtitle?: string;
  description?: unknown[];
  eventDate?: string;
  prizes?: Prize[];
  editalUrl?: string;
  coverImageUrl?: string;
}

export interface SiteSettings {
  title: string;
  slogan?: string;
  organizationName?: string;
  logoUrl?: string;
  heroImageUrl?: string;
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    whatsapp?: string;
  };
  contactInfo?: {
    address?: string;
    phone?: string;
    email?: string;
  };
  footerText?: string;
}
