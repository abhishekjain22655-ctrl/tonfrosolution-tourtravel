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
    openGraph: {
      title: pkg.title,
      description: pkg.overview.slice(0, 160),
      images: [{ url: pkg.heroImage }],
    },
  };
}

export const instant = false;

async function PackageDetailResolver({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const initialPackage = packagesData.find((p) => p.slug === slug);

  return <PackageDetailClient slug={slug} initialPackage={initialPackage} />;
}

export default function PackageDetailPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-[#64748B]">Loading package details...</div>}>
      <PackageDetailResolver params={params} />
    </Suspense>
  );
}
