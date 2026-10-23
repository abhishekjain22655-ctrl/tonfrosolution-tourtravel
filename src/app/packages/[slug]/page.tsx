import React, { Suspense } from 'react';
import { packagesData } from '@/data/packages';
import { agencyConfig } from '@/config/agency';
import PackageDetailClient from '@/components/PackageDetailClient';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return packagesData.map((pkg) => ({
    slug: pkg.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const pkg = packagesData.find((p) => p.slug === slug);
  if (!pkg) {
    return {
      title: `Curated Holiday Package | ${agencyConfig.companyName}`,
      description: 'Handcrafted holiday itinerary with verified luxury stays and private transfers.',
    };
  }

  return {
    title: `${pkg.title} | ${agencyConfig.companyName}`,
    description: pkg.overview.slice(0, 160),
    alternates: {
      canonical: `/packages/${slug}`,
    },
    openGraph: {
      title: pkg.title,
      description: pkg.overview.slice(0, 160),
      images: [{ url: pkg.heroImage }],
      url: `/packages/${slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pkg.title,
      description: pkg.overview.slice(0, 160),
      images: [pkg.heroImage],
    },
  };
}

export const instant = false;

async function PackageDetailResolver({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const initialPackage = packagesData.find((p) => p.slug === slug);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || agencyConfig.seo.siteUrl || 'https://tonfrosolution-tourtravel.vercel.app';

  const tripJsonLd = initialPackage
    ? {
        '@context': 'https://schema.org',
        '@type': ['TouristTrip', 'Product'],
        name: initialPackage.title,
        description: initialPackage.overview,
        image: initialPackage.heroImage,
        touristType: initialPackage.categories,
        itinerary: initialPackage.itinerary?.map((item) => ({
          '@type': 'TouristAttraction',
          name: item.title,
          description: item.description,
        })),
        offers: {
          '@type': 'Offer',
          price: initialPackage.startingPriceINR,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: `${siteUrl}/packages/${slug}`,
          seller: {
            '@type': 'TravelAgency',
            name: agencyConfig.companyName,
            url: siteUrl,
          },
        },
      }
    : null;

  return (
    <>
      {tripJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(tripJsonLd) }}
        />
      )}
      <PackageDetailClient slug={slug} initialPackage={initialPackage} />
    </>
  );
}

export default function PackageDetailPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-[#64748B]">Loading package details...</div>}>
      <PackageDetailResolver params={params} />
    </Suspense>
  );
}
