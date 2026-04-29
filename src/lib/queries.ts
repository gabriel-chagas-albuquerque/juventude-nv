// Youth Units
export const YOUTH_UNITS_QUERY = `*[_type == "youthUnit"] | order(name asc) {
  _id,
  name,
  address,
  leader,
  cultDays,
  whatsappLink,
  "imageUrl": image.asset->url
}`;

// Schedule
export const SCHEDULE_QUERY = `*[_type == "youthSchedule"] {
  _id,
  title,
  eventDate,
  dayOfWeek,
  time,
  description,
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
  title,
  slogan,
  organizationName,
  "logoUrl": logo.asset->url,
  "heroImageUrl": heroImage.asset->url,
  socialLinks,
  contactInfo,
  footerText
}`;
