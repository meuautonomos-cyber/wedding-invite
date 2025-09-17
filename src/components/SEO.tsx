'use client'

import Head from 'next/head'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  noindex?: boolean
}

export default function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
  noindex = false
}: SEOProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://casamento-km.vercel.app'
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl
  const fullImage = image ? `${baseUrl}${image}` : `${baseUrl}/images/og-image.jpg`

  return (
    <Head>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Convite de Casamento" />
      <meta property="og:locale" content="pt_BR" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: title,
            description: description,
            startDate: '2026-03-21T16:00:00-03:00',
            endDate: '2026-03-21T20:00:00-03:00',
            location: {
              '@type': 'Place',
              name: 'Vitória - ES',
              address: 'Vitória, Espírito Santo, Brasil'
            },
            organizer: {
              '@type': 'Person',
              name: 'Anthony & Esther'
            },
            image: fullImage,
            url: fullUrl
          })
        }}
      />
    </Head>
  )
}
