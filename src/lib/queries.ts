// Schedule (Programação)
export const SCHEDULE_QUERY = `*[_type == "evento"] | order(horario asc) {
  _id,
  "title": titulo,
  tipoRecorrencia,
  diaDaSemana,
  ordemMensal,
  dataFixa,
  "time": horario,
  "description": descricao,
  location,
  address
}`;


// Form Categories
export const FORM_CATEGORIES_QUERY = `*[_type == "formCategory"] | order(label asc) {
  _id,
  label,
  "identifier": value.current,
  questions[] {
    question,
    fieldName,
    fieldType,
    required,
    placeholder
  }
}`;

// Form Questions by Category
export const FORM_QUESTIONS_QUERY = `*[_type == "formQuestion" && $categoryId in categories[]._ref] | order(order asc) {
  _id,
  question,
  "fieldName": fieldName.current,
  fieldType,
  placeholder,
  required
}`;

// ENEM Cristao
export const ENEM_QUERY = `*[_type == "siteSettings"][0].enemCristao {
  badge,
  title,
  subtitle,
  description,
  features,
  eventDate,
  prizes,
  "editalUrl": editalFile.asset->url,
  ctaText,
  ctaButtonText
}`;

// SITE SETTINGS (FULL DOCUMENT)
export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0] {
  home {
    title,
    slogan,
    organizationName,
    "logoUrl": logo.asset->url,
    "heroImageUrl": heroImage.asset->url,
    socialLinks,
    contactInfo,
    footerText
  },
  aboutUs {
    title,
    description,
    values
  },
  enemCristao {
    badge,
    title,
    subtitle,
    description,
    features,
    eventDate,
    prizes,
    "editalUrl": editalFile.asset->url,
    ctaText,
    ctaButtonText
  }
}`;

// ABOUT US (Legacy/Specific - can be removed or kept if needed)
export const ABOUT_US_QUERY = `*[_type == "siteSettings"][0].aboutUs {
  title,
  description,
  values
}`;
