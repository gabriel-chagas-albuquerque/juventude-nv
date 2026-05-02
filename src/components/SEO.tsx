import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: string;
}

export function SEO({ 
  title, 
  description, 
  canonical, 
  type = 'website' 
}: SEOProps) {
  const siteTitle = "Juventude NV";
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const siteDescription = description || "Portal oficial da Juventude NV - Igreja Assembleia de Deus Novo Viver.";
  const url = "https://juventude-nv.vercel.app";

  return (
    <Helmet>
      {/* Título e Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={siteDescription} />
      {canonical && <link rel="canonical" href={`${url}${canonical}`} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={`${url}${canonical || ''}`} />

      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={siteDescription} />
    </Helmet>
  );
}
