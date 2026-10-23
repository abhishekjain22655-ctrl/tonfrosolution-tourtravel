import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { agencyConfig } from '@/config/agency';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActionButtons from '@/components/FloatingActionButtons';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || agencyConfig.seo.siteUrl || 'https://tonfrosolution-tourtravel.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: agencyConfig.seo.defaultTitle,
    template: agencyConfig.seo.titleTemplate,
  },
  description: agencyConfig.seo.defaultDescription,
  keywords: agencyConfig.seo.keywords,
  alternates: {
    canonical: '/',
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  openGraph: {
    title: agencyConfig.seo.defaultTitle,
    description: agencyConfig.seo.defaultDescription,
    url: siteUrl,
    siteName: agencyConfig.companyName,
    images: [
      {
        url: agencyConfig.seo.ogImage,
        width: 1200,
        height: 630,
        alt: agencyConfig.companyName,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: agencyConfig.seo.defaultTitle,
    description: agencyConfig.seo.defaultDescription,
    images: [agencyConfig.seo.ogImage],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TravelAgency',
      '@id': `${siteUrl}/#agency`,
      name: agencyConfig.companyName,
      legalName: agencyConfig.legalEntityName,
      url: siteUrl,
      image: agencyConfig.seo.ogImage,
      description: agencyConfig.description,
      telephone: agencyConfig.contact.primaryPhone,
      email: agencyConfig.contact.email,
      priceRange: '₹₹₹',
      currenciesAccepted: 'INR',
      paymentAccepted: 'Cash, Credit Card, Bank Transfer, UPI',
      address: {
        '@type': 'PostalAddress',
        streetAddress: agencyConfig.contact.officeAddress.street,
        addressLocality: agencyConfig.contact.officeAddress.city,
        addressRegion: agencyConfig.contact.officeAddress.state,
        postalCode: agencyConfig.contact.officeAddress.pincode,
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '28.6989',
        longitude: '77.1384',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:30',
          closes: '19:00',
        },
      ],
      areaServed: [
        { '@type': 'Country', name: 'India' },
        { '@type': 'AdministrativeArea', name: 'Worldwide' },
      ],
      sameAs: [
        agencyConfig.socials.instagram,
        agencyConfig.socials.facebook,
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: agencyConfig.companyName,
      description: agencyConfig.seo.defaultDescription,
      publisher: {
        '@id': `${siteUrl}/#agency`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/packages?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-[#C25E34]/20 selection:text-[#C25E34]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingActionButtons />
      </body>
    </html>
  );
}
