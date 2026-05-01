export interface FormQuestion {
  question: string;
  fieldName: {
    current: string;
  };
  fieldType: 'text' | 'textarea' | 'email' | 'tel' | 'date' | 'number' | 'cpf' | 'boolean';
  required: boolean;
  placeholder?: string;
}

export interface FormCategory {
  _id: string;
  label: string;
  identifier: {
    current: string;
  };
  questions?: FormQuestion[];
}

export interface SiteSettings {
  home: {
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
  };
  aboutUs?: AboutUs;
  enemCristao?: EnemCristao;
}

export interface AboutUs {
  title: string;
  description: string;
  values: {
    title: string;
    description: string;
    icon: string;
  }[];
}

export interface ScheduleItem {
  _id: string;
  title: string;
  description?: string;
  time?: string;
  location?: string;
  diaDaSemana?: string;
  tipoRecorrencia: 'semanal' | 'mensal_ordinal' | 'mensal_dia' | 'unico';
  ordemMensal?: string;
  dataFixa?: string;
}

export interface EnemFeature {
  title: string;
  description: string;
  icon: string;
}

export interface EnemCristao {
  badge?: string;
  title: string;
  subtitle?: string;
  description?: any; // Portable Text
  eventDate?: string;
  features?: EnemFeature[];
  prizes?: {
    position: string;
    prize: string;
  }[];
  editalUrl?: string;
  ctaText?: string;
  ctaButtonText?: string;
}
