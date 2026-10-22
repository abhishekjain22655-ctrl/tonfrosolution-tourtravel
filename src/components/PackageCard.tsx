import React from 'react';
import Link from 'next/link';
import { Clock, MapPin, Tag, ArrowRight, MessageCircle } from 'lucide-react';
import { TravelPackage } from '@/types/travel';
import { agencyConfig } from '@/config/agency';

interface PackageCardProps {
  pkg: TravelPackage;
}

export default function PackageCard({ pkg }: PackageCardProps) {
  const whatsappUrl = `https://wa.me/${agencyConfig.contact.whatsappNumber}?text=${agencyConfig.whatsappTemplates.packageEnquiry(
    pkg.title,
    `${pkg.durationDays}D / ${pkg.durationNights}N`
  )}`;

  return (
    <div className="group bg-white rounded-2xl border border-[#E8E3DA] overflow-hidden card-hover-lift flex flex-col justify-between">
      <div>
        {/* Card Image Container with smooth internal zoom */}
        <div className="relative h-60 w-full overflow-hidden bg-slate-100">
          <img
            src={pkg.heroImage}
            alt={pkg.title}
            className="w-full h-full object-cover card-zoom-image"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {pkg.badge && (
              <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-[#C25E34] text-white shadow-sm">
                {pkg.badge}
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide bg-white/95 text-[#0F172A] backdrop-blur-sm shadow-2xs">
              {pkg.destinationType === 'domestic' ? 'India' : 'International'}
            </span>
          </div>

          {/* Duration Badge Bottom Right */}
          <div className="absolute bottom-3 right-3 z-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-black/70 text-white backdrop-blur-sm">
              <Clock className="w-3.5 h-3.5 text-[#C58B3E]" />
              {pkg.durationDays} Days / {pkg.durationNights} Nights
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#154D4F] mb-2">
            <MapPin className="w-3.5 h-3.5 text-[#C25E34] shrink-0" />
            <span>{pkg.destinationName} • {pkg.regionOrCountry}</span>
          </div>

          <h3 className="text-lg font-serif-luxury font-bold text-[#0F172A] leading-snug group-hover:text-[#C25E34] transition-colors mb-2 line-clamp-2">
            {pkg.title}
          </h3>

          <p className="text-xs text-[#64748B] line-clamp-2 mb-4 leading-relaxed font-light">
            {pkg.tagline}
          </p>

          {/* Categories / Tags */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {pkg.categories.slice(0, 2).map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#FAF8F5] text-[#475569] border border-[#E8E3DA]"
              >
                <Tag className="w-2.5 h-2.5 text-[#C58B3E]" />
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer & Price / CTA */}
      <div className="px-5 sm:px-6 pb-5 pt-3.5 border-t border-[#F1ECE4] flex items-center justify-between">
        <div>
          <span className="block text-[10px] uppercase font-semibold tracking-wider text-[#94A3B8]">
            Starting Price
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold font-serif-luxury text-[#0F172A]">
              ₹{pkg.startingPriceINR.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-[#64748B]">/ guest</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Chat on WhatsApp about this package"
            className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all active:scale-95"
            aria-label="Enquire on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>

          <Link
            href={`/packages/${pkg.slug}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#154D4F] hover:bg-[#C25E34] text-white transition-all active:scale-95 shadow-2xs"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
