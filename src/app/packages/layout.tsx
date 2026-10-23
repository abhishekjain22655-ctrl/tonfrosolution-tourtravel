import type { Metadata } from 'next';
import { agencyConfig } from '@/config/agency';

export const metadata: Metadata = {
  title: 'Curated Holiday Packages & Tour Itineraries',
  description:
    'Explore handcrafted domestic and international travel packages from New Delhi with verified 4-star stays, private sanitized vehicles, transparent pricing, and 24/7 concierge assistance.',
  alternates: {
    canonical: '/packages',
  },
  openGraph: {
    title: 'Curated Holiday Packages | Tonfro Solution Tour and Travel',
    description:
      'Compare day-by-day itineraries, transparent pricing, and book your dream domestic or global vacation.',
    url: '/packages',
    type: 'website',
  },
};

export default function PackagesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
