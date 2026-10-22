import React from 'react';
import Link from 'next/link';
import { Compass, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { packagesData } from '@/data/packages';
import { destinationsData } from '@/data/destinations';
import PackageCard from '@/components/PackageCard';

export const metadata = {
  title: 'International Tour Packages | Curated Global Holidays',
  description: 'Handcrafted international holiday packages to Switzerland, Bali, Dubai, Vietnam, and Europe with visa assistance and premium stays.',
};

export default function InternationalPage() {
  const internationalPackages = packagesData.filter((p) => p.destinationType === 'international');
  const internationalDestinations = destinationsData.filter((d) => d.type === 'international');

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Editorial Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#154D4F]/10 text-xs font-bold uppercase tracking-wider text-[#154D4F] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C25E34]" />
            <span>Curated Global Escapes</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif-luxury font-bold text-[#0F172A] mb-3 leading-tight">
            International Holiday Experiences
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
            Ascend to the Top of Europe on panoramic Swiss trains, relax in private pool villas in Seminyak, watch desert sunsets in Dubai, or cruise through Ha Long Bay’s limestone peaks. Complete with visa consultation and verified English-speaking local guides.
          </p>
        </div>

        {/* Destination Quick Pill Links */}
        <div className="mb-10 pb-6 border-b border-[#E8E3DA]">
          <span className="block text-xs uppercase font-bold tracking-wider text-[#94A3B8] mb-3">
            Popular Global Destinations:
          </span>
          <div className="flex flex-wrap gap-2.5">
            {internationalDestinations.map((d) => (
              <Link
                key={d.id}
                href={`/packages?destination=${d.slug}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-[#154D4F] border border-[#E8E3DA] hover:border-[#C25E34] hover:text-[#C25E34] transition-all shadow-2xs"
              >
                <MapPin className="w-3 h-3 text-[#C25E34]" />
                <span>{d.name}</span>
                <span className="text-[10px] bg-[#FAF8F5] px-1.5 py-0.2 rounded-full text-[#64748B]">
                  {d.packageCount}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {internationalPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>

        {/* International Visa Support Callout */}
        <div className="mt-16 p-8 sm:p-12 rounded-2xl bg-[#0F1E20] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C58B3E]">
              Seamless Visa & Documentation
            </span>
            <h3 className="text-2xl font-serif-luxury font-bold">
              Stress-Free International Travel For Indian Passport Holders
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl">
              We guide you through Schengen visa appointments, Dubai e-visas, Vietnam authorizations, and currency advice step-by-step.
            </p>
          </div>
          <Link
            href="/plan-your-trip"
            className="shrink-0 px-6 py-3.5 rounded-xl bg-[#C25E34] hover:bg-[#A74E28] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md"
          >
            Consult Our Specialists
          </Link>
        </div>
      </div>
    </div>
  );
}
