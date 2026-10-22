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

export const metadata: Metadata = {
  title: {
    default: agencyConfig.seo.defaultTitle,
    template: agencyConfig.seo.titleTemplate,
  },
  description: agencyConfig.seo.defaultDescription,
  keywords: agencyConfig.seo.keywords,
  openGraph: {
    title: agencyConfig.seo.defaultTitle,
    description: agencyConfig.seo.defaultDescription,
    url: agencyConfig.seo.siteUrl,
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col antialiased selection:bg-[#C25E34]/20 selection:text-[#C25E34]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingActionButtons />
      </body>
    </html>
  );
}
