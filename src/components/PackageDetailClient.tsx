'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Clock,
  MapPin,
  Calendar,
  ShieldCheck,
  Check,
  X,
  Phone,
  MessageCircle,
  Sparkles,
  Hotel,
  Navigation,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { TravelPackage } from '@/types/travel';
import { agencyConfig, getPhoneLink } from '@/config/agency';
import { getPackageBySlug, getPublishedPackages } from '@/lib/storage';
import PackageCard from '@/components/PackageCard';
import EnquiryForm from '@/components/EnquiryForm';

interface PackageDetailClientProps {
  slug: string;
  initialPackage?: TravelPackage;
}

export default function PackageDetailClient({
  slug,
  initialPackage,
}: PackageDetailClientProps) {
  const [pkg, setPkg] = useState<TravelPackage | undefined>(initialPackage);
  const [activeImage, setActiveImage] = useState<string>(initialPackage?.heroImage || '');
  const [relatedPackages, setRelatedPackages] = useState<TravelPackage[]>([]);

  useEffect(() => {
    // Check storage for latest data (in case price or details were edited in Admin)
    const stored = getPackageBySlug(slug);
    const candidate = stored || initialPackage;
    if (candidate && candidate.status && candidate.status !== 'published') {
      // Draft package is hidden from the public website
      setPkg(undefined);
    } else if (candidate) {
      setPkg(candidate);
      if (!activeImage) setActiveImage(candidate.heroImage);
    } else {
      setPkg(undefined);
    }

    const allPub = getPublishedPackages();
    const related = allPub
      .filter((p) => p.slug !== slug && (stored ? p.destinationType === stored.destinationType : true))
      .slice(0, 3);
    setRelatedPackages(related);
  }, [slug, initialPackage]);

  if (!pkg) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl border border-[#E8E3DA] shadow-sm space-y-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mx-auto">
            <MapPin className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-serif-luxury font-bold text-[#0F172A]">
            Package Not Found
          </h2>
          <p className="text-xs text-[#64748B]">
            This itinerary may have been unpublished or removed by the agency administrator.
          </p>
          <div className="pt-2">
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#154D4F] text-white text-xs font-semibold hover:bg-[#C25E34] transition-colors"
            >
              <span>Explore Available Packages</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const whatsappUrl = `https://wa.me/${agencyConfig.contact.whatsappNumber}?text=${agencyConfig.whatsappTemplates.packageEnquiry(
    pkg.title,
    `${pkg.durationDays}D / ${pkg.durationNights}N`
  )}`;

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-[#E8E3DA] py-3 px-4 sm:px-8 text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <Link href="/" className="hover:text-[#C25E34]">Home</Link>
          <span>/</span>
          <Link
            href={pkg.destinationType === 'domestic' ? '/domestic' : '/international'}
            className="hover:text-[#C25E34]"
          >
            {pkg.destinationType === 'domestic' ? 'Domestic Holidays' : 'International Holidays'}
          </Link>
          <span>/</span>
          <span className="text-[#0F172A] font-semibold truncate max-w-xs sm:max-w-md">
            {pkg.title}
          </span>
        </div>
      </div>

      {/* Hero Header & Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        <div className="space-y-4 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            {pkg.badge && (
              <span className="px-3 py-1 rounded-full text-xs uppercase font-bold tracking-wider bg-[#C25E34] text-white">
                {pkg.badge}
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#154D4F]/10 text-[#154D4F]">
              {pkg.destinationType === 'domestic' ? 'India' : 'International'}
            </span>
            <span className="text-xs text-[#64748B] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#C25E34]" />
              {pkg.destinationName} • {pkg.regionOrCountry}
            </span>
            {pkg.status === 'draft' && (
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                Staff Preview (Draft)
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-[#0F172A] leading-tight">
            {pkg.title}
          </h1>

          <p className="text-base sm:text-lg text-[#475569] max-w-4xl leading-relaxed">
            {pkg.tagline}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-white border border-[#E8E3DA] shadow-2xs">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#C25E34]" />
              <div>
                <span className="block text-[10px] uppercase font-semibold text-[#94A3B8]">Duration</span>
                <span className="text-xs font-bold text-[#0F172A]">{pkg.durationDays} Days / {pkg.durationNights} Nights</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Hotel className="w-5 h-5 text-[#C25E34]" />
              <div>
                <span className="block text-[10px] uppercase font-semibold text-[#94A3B8]">Stay Tier</span>
                <span className="text-xs font-bold text-[#0F172A]">{pkg.hotelCategory ? pkg.hotelCategory.split('+')[0] : 'Handpicked Boutique Hotels'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#C25E34]" />
              <div>
                <span className="block text-[10px] uppercase font-semibold text-[#94A3B8]">Best Season</span>
                <span className="text-xs font-bold text-[#0F172A] truncate max-w-[140px]">{pkg.bestTimeToVisit ? pkg.bestTimeToVisit.split('(')[0] : 'All Season'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#C25E34]" />
              <div>
                <span className="block text-[10px] uppercase font-semibold text-[#94A3B8]">Starting From</span>
                <span className="text-xs font-bold text-[#154D4F]">₹{pkg.startingPriceINR.toLocaleString('en-IN')} / guest</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Grid & Multi-Image Filmstrip */}
        <div className="space-y-3 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-2xl overflow-hidden">
            <div className="md:col-span-2 h-[350px] sm:h-[460px] relative overflow-hidden bg-slate-100">
              <img
                src={activeImage || pkg.heroImage}
                alt={pkg.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>
            <div className="grid grid-rows-2 gap-4 h-[350px] sm:h-[460px]">
              {(pkg.galleryImages && pkg.galleryImages.length > 1
                ? pkg.galleryImages.slice(1, 3)
                : [pkg.heroImage, pkg.heroImage]
              ).map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImage(imgUrl)}
                  className="relative h-full overflow-hidden bg-slate-100 cursor-pointer group"
                >
                  <img
                    src={imgUrl}
                    alt={`${pkg.title} view ${idx + 2}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Multi-Image Strip (if package has more than 2 photos) */}
          {pkg.galleryImages && pkg.galleryImages.length > 2 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2">
              {pkg.galleryImages.map((imgUrl, idx) => {
                const isSelected = (activeImage || pkg.heroImage) === imgUrl;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(imgUrl)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#C25E34] ring-2 ring-[#C25E34]/30'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 2-Column Main Section: Content (Left) + Sticky Booking Card (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column (8 cols): Itinerary, Inclusions, Terms */}
          <div className="lg:col-span-8 space-y-12">
            {/* 1. Overview */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E3DA] shadow-sm space-y-4">
              <h2 className="text-2xl font-serif-luxury font-bold text-[#0F172A]">
                Journey Overview
              </h2>
              <p className="text-sm text-[#475569] leading-relaxed">
                {pkg.overview}
              </p>

              {/* Route breakdown */}
              {pkg.route && (
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA] space-y-1">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#154D4F] flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-[#C25E34]" />
                    Planned Route
                  </span>
                  <p className="text-xs font-semibold text-[#0F172A]">{pkg.route}</p>
                </div>
              )}
            </section>

            {/* 2. Day-by-Day Itinerary */}
            {pkg.itinerary && pkg.itinerary.length > 0 && (
              <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E3DA] shadow-sm space-y-6">
                <div className="border-b border-[#E8E3DA] pb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#C25E34] block mb-1">
                    Day-by-Day Journey
                  </span>
                  <h2 className="text-2xl font-serif-luxury font-bold text-[#0F172A]">
                    Detailed Schedule & Daily Highlights
                  </h2>
                </div>

                <div className="space-y-6">
                  {pkg.itinerary.map((dayItem) => (
                    <div
                      key={dayItem.day}
                      className="relative pl-7 pb-6 border-l-2 border-[#154D4F]/30 last:border-l-0 last:pb-0"
                    >
                      <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-[#154D4F] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                        D{dayItem.day}
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-base font-bold font-serif-luxury text-[#0F172A]">
                          {dayItem.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                          {dayItem.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                          {dayItem.mealsIncluded && dayItem.mealsIncluded.length > 0 && (
                            <span className="px-2.5 py-1 rounded-md bg-[#FAF8F5] text-[#154D4F] border border-[#E8E3DA] font-medium text-[11px]">
                              🍽️ Meals: {dayItem.mealsIncluded.join(', ')}
                            </span>
                          )}
                          {dayItem.stay && (
                            <span className="px-2.5 py-1 rounded-md bg-[#FAF8F5] text-[#154D4F] border border-[#E8E3DA] font-medium text-[11px]">
                              🏨 Stay: {dayItem.stay}
                            </span>
                          )}
                        </div>

                        {dayItem.highlights && dayItem.highlights.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {dayItem.highlights.map((h, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200"
                              >
                                ★ {h}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 3. Inclusions & Exclusions */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E3DA] shadow-sm">
              <h2 className="text-2xl font-serif-luxury font-bold text-[#0F172A] mb-6">
                Package Inclusions & Exclusions
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inclusions */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 pb-2 border-b border-emerald-100">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>What is Included</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-[#334155]">
                    {pkg.inclusions && pkg.inclusions.length > 0 ? (
                      pkg.inclusions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))
                    ) : (
                      <li>Verified accommodation, transfers, and daily breakfasts included.</li>
                    )}
                  </ul>
                </div>

                {/* Exclusions */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-800 pb-2 border-b border-rose-100">
                    <X className="w-4 h-4 text-rose-600" />
                    <span>What is Not Included</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-[#334155]">
                    {pkg.exclusions && pkg.exclusions.length > 0 ? (
                      pkg.exclusions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <X className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))
                    ) : (
                      <li>Airfares and personal expenses.</li>
                    )}
                  </ul>
                </div>
              </div>
            </section>

            {/* 4. Cancellation & Booking Policy */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E3DA] shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                <FileText className="w-4 h-4 text-[#C25E34]" />
                <span>Transparent Cancellation & Payment Terms</span>
              </div>
              <ul className="space-y-2 text-xs text-[#475569]">
                {pkg.cancellationPolicy && pkg.cancellationPolicy.length > 0 ? (
                  pkg.cancellationPolicy.map((term, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#C25E34] font-bold">•</span>
                      <span>{term}</span>
                    </li>
                  ))
                ) : (
                  <li>Standard 30-day cancellation terms apply.</li>
                )}
              </ul>
            </section>
          </div>

          {/* Right Column (4 cols): Sticky Quote & WhatsApp CTA + Direct Enquiry Box */}
          <div className="lg:col-span-4 space-y-6 sticky top-28">
            <div className="bg-white p-6 rounded-2xl border border-[#E8E3DA] shadow-lg space-y-5">
              <div>
                <span className="block text-[11px] uppercase font-semibold tracking-wider text-[#94A3B8]">
                  Starting Package Price
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-serif-luxury text-[#0F172A]">
                    ₹{pkg.startingPriceINR.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-[#64748B]">/ guest</span>
                </div>
                {pkg.originalPriceINR && (
                  <p className="text-xs text-[#94A3B8] line-through mt-0.5">
                    Regular: ₹{pkg.originalPriceINR.toLocaleString('en-IN')}
                  </p>
                )}
                <p className="text-[11px] text-[#64748B] mt-1">
                  * Price based on twin-sharing accommodation. Flights available as optional add-on.
                </p>
              </div>

              {/* Instant CTAs */}
              <div className="space-y-2.5 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enquire on WhatsApp</span>
                </a>

                <a
                  href={getPhoneLink()}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#FAF8F5] hover:bg-white text-[#0F172A] border border-[#E8E3DA] font-semibold text-xs tracking-wider uppercase transition-all"
                >
                  <Phone className="w-4 h-4 text-[#C58B3E]" />
                  <span>Call {agencyConfig.contact.displayPhone}</span>
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA] text-[11px] text-[#64748B] space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-[#154D4F]">
                  <ShieldCheck className="w-4 h-4 text-[#C25E34]" />
                  <span>Booking with Confidence</span>
                </div>
                <p className="leading-relaxed">
                  ✓ Free date change flexibility on request.<br />
                  ✓ Verified 4-star properties.<br />
                  ✓ Dedicated WhatsApp concierge manager.
                </p>
              </div>
            </div>

            {/* In-Page Quick Custom Enquiry */}
            <div className="bg-white p-6 rounded-2xl border border-[#E8E3DA] shadow-sm">
              <h3 className="text-base font-bold font-serif-luxury text-[#0F172A] mb-1">
                Customize This Itinerary
              </h3>
              <p className="text-xs text-[#64748B] mb-4">
                Want extra nights, hotel upgrades, or private flights?
              </p>
              <EnquiryForm
                originPackageSlug={pkg.slug}
                originPackageTitle={pkg.title}
                defaultDestination={pkg.destinationName}
                defaultTripType={pkg.destinationType}
              />
            </div>
          </div>
        </div>

        {/* Related Packages Carousel / Grid */}
        {relatedPackages.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#E8E3DA]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#C25E34] block mb-1">
                  More Inspiring Holidays
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0F172A]">
                  Similar {pkg.destinationType === 'domestic' ? 'Indian' : 'International'} Journeys
                </h3>
              </div>

              <Link
                href={pkg.destinationType === 'domestic' ? '/domestic' : '/international'}
                className="text-xs font-bold uppercase tracking-wider text-[#154D4F] hover:text-[#C25E34] flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPackages.map((rel) => (
                <PackageCard key={rel.id} pkg={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
