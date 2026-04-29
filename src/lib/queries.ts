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
export const FORM_CATEGORIES_QUERY = `*[_type == "formCategory"] | order(order asc) {
  _id,
  label,
  "value": value.current,
  description
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
export const ENEM_QUERY = `*[_type == "enemCristao"][0] {
  _id,
  title,
  subtitle,
  description,
  eventDate,
  prizes,
  "editalUrl": editalFile.asset->url,
  "coverImageUrl": coverImage.asset->url
}`;
// SITE SETTINGS
export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0] {
  ...,
  "logoUrl": logo.asset->url,
  "heroImageUrl": heroImage.asset->url,
  socialLinks,
  contactInfo,
  footerText
}`;

export const ABOUT_US_QUERY = `*[_type == "aboutUs"][0]`;
