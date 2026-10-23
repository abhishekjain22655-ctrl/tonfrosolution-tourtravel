import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Domestic Holiday Packages in India | Kashmir, Kerala, Ladakh, Himachal',
  description:
    'Discover Incredible India with handcrafted domestic tours. Explore Dal Lake houseboats in Kashmir, Munnar tea hills in Kerala, Pangong Tso in Ladakh, and Andaman coral beaches with verified stays and 24/7 on-trip assistance.',
  alternates: {
    canonical: '/domestic',
  },
  openGraph: {
    title: 'Domestic Holiday Packages India | Tonfro Solution Tour and Travel',
    description:
      'Curated holiday packages across Kashmir, Kerala, Ladakh, Himachal, Rajasthan, and Andaman with verified boutique resorts and private transfers.',
    url: '/domestic',
    type: 'website',
  },
};

export default function DomesticLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
