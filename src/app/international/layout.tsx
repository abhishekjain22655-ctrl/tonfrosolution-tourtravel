import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'International Tour Packages from India | Switzerland, Dubai, Bali, Vietnam',
  description:
    'Plan your dream international trip with Tonfro Solution Tour and Travel. Ascend the Swiss Alps, experience Dubai desert glamping, relax in private Bali pool villas, and cruise Vietnam’s Ha Long Bay with visa guidance and local support.',
  alternates: {
    canonical: '/international',
  },
  openGraph: {
    title: 'International Holiday Packages | Tonfro Solution Tour and Travel',
    description:
      'Curated international vacations from India with confirmed hotel stays, private transfers, visa guidance, and 24/7 concierge assistance.',
    url: '/international',
    type: 'website',
  },
};

export default function InternationalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
