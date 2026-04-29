// Types for Sanity data
export interface YouthUnit {
  _id: string;
  name: string;
  address?: string;
  leader?: string;
  cultDays?: Array<{
    day: string;
    time: string;
  }>;
  whatsappLink?: string;
  imageUrl?: string;
}

export interface ScheduleItem {
  _id: string;
  title: string;
  eventDate?: string;
  dayOfWeek: string;
  time?: string;
  description?: string;
  location?: string;
  address?: string;
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
