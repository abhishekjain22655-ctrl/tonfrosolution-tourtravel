'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, MapPin } from 'lucide-react';
import { packagesData } from '@/data/packages';
import { destinationsData } from '@/data/destinations';
import { getPublishedPackages } from '@/lib/storage';
import { TravelPackage } from '@/types/travel';
import PackageCard from '@/components/PackageCard';

export default function DomesticPage() {
  const [packagesList, setPackagesList] = useState<TravelPackage[]>(packagesData);

  useEffect(() => {
    setPackagesList(getPublishedPackages());
    const handleUpdate = () => setPackagesList(getPublishedPackages());
    window.addEventListener('packages_updated', handleUpdate);
    return () => window.removeEventListener('packages_updated', handleUpdate);
  }, []);

  const domesticPackages = packagesList.filter(
    (p) => p.destinationType === 'domestic' && (p.status === 'published' || !p.status)
  );
  const domesticDestinations = destinationsData.filter((d) => d.type === 'domestic');

  const getDestTripCount = (dest: (typeof destinationsData)[0]) => {
    return domesticPackages.filter(
      (p) =>
        p.destinationName.toLowerCase().includes(dest.name.toLowerCase()) ||
        dest.name.toLowerCase().includes(p.destinationName.toLowerCase()) ||
        p.slug.toLowerCase().includes(dest.slug.toLowerCase()) ||
        p.regionOrCountry.toLowerCase().includes(dest.name.toLowerCase())
    ).length;
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Editorial Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#154D4F]/10 text-xs font-bold uppercase tracking-wider text-[#154D4F] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C25E34]" />
            <span>Incredible India Tours ({domesticPackages.length})</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif-luxury font-bold text-[#0F172A] mb-3 leading-tight">
            Handcrafted Domestic Holidays
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
            From the pine-fringed shikaras of Dal Lake to the spice plantations of Munnar and the desert forts of Rajasthan. Every domestic itinerary includes verified 4-star stays, dedicated sanitized vehicles, and 24/7 on-trip assistance.
          </p>
        </div>

        {/* Destination Quick Pill Links */}
        <div className="mb-10 pb-6 border-b border-[#E8E3DA]">
          <span className="block text-xs uppercase font-bold tracking-wider text-[#94A3B8] mb-3">
            Explore by Region:
          </span>
          <div className="flex flex-wrap gap-2.5">
            {domesticDestinations.map((d) => {
              const tripCount = getDestTripCount(d);
              return (
                <Link
                  key={d.id}
                  href={`/packages?destination=${d.slug}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-[#154D4F] border border-[#E8E3DA] hover:border-[#C25E34] hover:text-[#C25E34] transition-all shadow-2xs"
                >
                  <MapPin className="w-3 h-3 text-[#C25E34]" />
                  <span>{d.name}</span>
                  <span className="text-[10px] bg-[#FAF8F5] px-1.5 py-0.2 rounded-full text-[#64748B]">
                    {tripCount}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Section Count Header */}
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#E8E3DA]/60">
          <p className="text-xs font-bold uppercase tracking-wider text-[#154D4F]">
            All Domestic Packages ({domesticPackages.length})
          </p>
          <span className="text-xs text-[#64748B]">
            Showing {domesticPackages.length} active itineraries
          </span>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {domesticPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>

        {/* Custom Tailored CTA Banner */}
        <div className="mt-16 p-8 sm:p-12 rounded-2xl bg-[#154D4F] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-serif-luxury font-bold">
              Looking for a Customized Domestic Route?
            </h3>
            <p className="text-xs sm:text-sm text-[#CBD5E1] max-w-xl">
              We specialize in tailor-made family holidays, senior-citizen friendly pacing, and honeymoon surprises across any Indian state.
            </p>
          </div>
          <Link
            href="/plan-your-trip"
            className="shrink-0 px-6 py-3.5 rounded-xl bg-[#C25E34] hover:bg-[#A74E28] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md"
          >
            Request Custom Quote
          </Link>
        </div>
      </div>
    </div>
  );
}
