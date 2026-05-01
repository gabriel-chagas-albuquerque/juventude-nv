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
  title: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl?: string;
  logoUrl?: string;
  footerText?: string;
  organizationName?: string;
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    whatsapp?: string;
  };
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

export interface EnemCristao {
  _id: string;
  title: string;
  subtitle?: string;
  description: string;
  eventDate?: string;
  prizes?: {
    position: string;
    prize: string;
  }[];
  editalUrl?: string;
  coverImageUrl?: string;
}
