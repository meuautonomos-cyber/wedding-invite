import type { Metadata } from 'next'
import { Cormorant_Garamond, Great_Vibes, Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { weddingData } from '@/data/weddingData'

const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant'
})

const greatVibes = Great_Vibes({ 
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-great-vibes'
})

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter'
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-playfair'
})

export const metadata: Metadata = {
  title: weddingData.casamento.seo.title,
  description: weddingData.casamento.seo.description,
  keywords: [
    'casamento',
    'convite',
    'noivos',
    weddingData.casamento.noivos.nome_noiva,
    weddingData.casamento.noivos.nome_noivo,
    'cerimônia',
    'celebração',
    'RSVP',
    'lista de presentes'
  ],
  authors: [{ name: `${weddingData.casamento.noivos.nome_noiva} & ${weddingData.casamento.noivos.nome_noivo}` }],
  creator: `${weddingData.casamento.noivos.nome_noiva} & ${weddingData.casamento.noivos.nome_noivo}`,
  publisher: 'Wedding Invite',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: weddingData.casamento.seo.title,
    description: weddingData.casamento.seo.description,
    images: [
      {
        url: weddingData.casamento.seo.og_image,
        width: 1200,
        height: 630,
        alt: `Convite de casamento de ${weddingData.casamento.noivos.nome_noiva} & ${weddingData.casamento.noivos.nome_noivo}`,
      }
    ],
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Convite de Casamento',
  },
  twitter: {
    card: 'summary_large_image',
    title: weddingData.casamento.seo.title,
    description: weddingData.casamento.seo.description,
    images: [weddingData.casamento.seo.og_image],
    creator: '@wedding_invite',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#339970',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#339970' },
    ],
  },
  category: 'lifestyle',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${cormorant.variable} ${greatVibes.variable} ${inter.variable} ${playfair.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}
