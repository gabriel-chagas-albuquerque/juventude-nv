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
  organizationName?: string;
  socialLinks?: {
    platform: string;
    url: string;
  }[];
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
