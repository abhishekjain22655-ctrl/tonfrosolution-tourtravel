'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, ShieldCheck, Clock, MapPin, Users, HeartHandshake, Sparkles, MessageCircle, Star, Phone } from 'lucide-react';
import { agencyConfig, getWhatsAppLink, getPhoneLink } from '@/config/agency';
import { destinationsData } from '@/data/destinations';
import { packagesData } from '@/data/packages';
import { sampleTestimonials } from '@/data/testimonials';
import { TravelPackage } from '@/types/travel';
import { getPublishedPackages } from '@/lib/storage';
import PackageCard from '@/components/PackageCard';
import TripSearchHero from '@/components/TripSearchHero';
import EnquiryForm from '@/components/EnquiryForm';

export default function HomePage() {
  const [packagesList, setPackagesList] = useState<TravelPackage[]>(packagesData);

  useEffect(() => {
    setPackagesList(getPublishedPackages());
    const handleUpdate = () => {
      setPackagesList(getPublishedPackages());
    };
    window.addEventListener('packages_updated', handleUpdate);
    return () => window.removeEventListener('packages_updated', handleUpdate);
  }, []);

  const publishedPackages = packagesList.filter((p) => p.status === 'published' || !p.status);
  const domesticPackages = publishedPackages.filter((p) => p.destinationType === 'domestic');
  const internationalPackages = publishedPackages.filter((p) => p.destinationType === 'international');
  const domesticDestinations = destinationsData.filter((d) => d.type === 'domestic');
  const internationalDestinations = destinationsData.filter((d) => d.type === 'international');
  const featuredPackages = publishedPackages.filter((p) => p.featured);
  const displayPackages = featuredPackages.length > 0 ? featuredPackages : publishedPackages.slice(0, 6);

  const getDestinationPublishedPackages = (dest: (typeof destinationsData)[0]) => {
    return publishedPackages.filter((p) => {
      const q = dest.name.toLowerCase();
      const slug = dest.slug.toLowerCase();
      return (
        p.destinationName.toLowerCase().includes(q) ||
        q.includes(p.destinationName.toLowerCase()) ||
        p.regionOrCountry.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(slug)
      );
    });
  };

  const getDestinationPackageCount = (dest: (typeof destinationsData)[0]) => {
    return getDestinationPublishedPackages(dest).length;
  };

  // Only show destinations that have active published packages
  const activeDomesticDestinations = domesticDestinations.filter(
    (dest) => getDestinationPackageCount(dest) > 0
  );
  const activeInternationalDestinations = internationalDestinations.filter(
    (dest) => getDestinationPackageCount(dest) > 0
  );

  const categories = [
    {
      title: 'Honeymoon & Romance',
      slug: 'Honeymoon & Romance',
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80',
      description: 'Private villas, candlelit lakeside dinners, and peaceful retreats.',
    },
    {
      title: 'Family Vacations',
      slug: 'Family Vacation',
      image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=600&q=80',
      description: 'Comfortable transfers, kid-friendly activities, and spacious accommodations.',
    },
    {
      title: 'Adventure & Nature',
      slug: 'Adventure & Trekking',
      image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80',
      description: 'Himalayan passes, desert dunes, scuba reefs, and mountain glamping.',
    },
    {
      title: 'Luxury & Wellness',
      slug: 'Luxury & Wellness',
      image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80',
      description: 'Scenic train first-class, Ayurvedic wellness, and 5-star mountain suites.',
    },
    {
      title: 'Spiritual & Heritage',
      slug: 'Spiritual & Heritage',
      image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80',
      description: 'Centuries-old forts, living palaces, sacred rivers, and architectural marvels.',
    },
  ];

  const whyChooseUs = [
    {
      icon: <Phone className="w-6 h-6 text-[#C25E34]" />,
      title: 'Convenient Enquiry Options',
      desc: 'Connect easily with our team via direct phone call, WhatsApp, or through quick online enquiry forms.',
    },
    {
      icon: <Compass className="w-6 h-6 text-[#C25E34]" />,
      title: 'Domestic & Global Discovery',
      desc: 'Thoughtfully presented holiday choices across premier Indian destinations and exciting international trips.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#C25E34]" />,
      title: 'Clear Package Communication',
      desc: 'Transparent descriptions of day-wise itineraries, verified accommodation tiers, and inclusions shared upfront.',
    },
    {
      icon: <Users className="w-6 h-6 text-[#C25E34]" />,
      title: 'Personalized Travel Planning',
      desc: 'Attentive assistance to understand your schedule, group requirements, and destination preferences.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* ========================================================
          SECTION 2: CINEMATIC HERO
      ======================================================== */}
      <section className="relative min-h-[540px] h-[78vh] max-h-[690px] w-full flex items-center justify-center overflow-hidden">
        {/* Background Video with uniform cinematic tint */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-center"
          >
            <source src="/videos/hero-travel.mp4" type="video/mp4" />
          </video>
          {/* Uniform dark tint across the video for pristine contrast */}
          <div className="absolute inset-0 bg-slate-950/45" />
          {/* Subtle top dark fade */}
          <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#0A1E20]/80 to-transparent pointer-events-none" />
          {/* Soft, minimal bottom transition without any milky/white haze */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FAF8F5]/40 to-transparent pointer-events-none" />
        </div>

        {/* Hero Content - balanced vertical position */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 text-center text-white space-y-4 sm:space-y-5 -mt-6 sm:-mt-8">
          {/* Official Agency Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-amber-300/35 text-[11px] sm:text-xs tracking-[0.22em] uppercase font-semibold text-amber-100 shadow-xl">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Discover the World. Experience More.</span>
          </div>

          {/* Official Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif-luxury font-bold tracking-tight text-white leading-[1.12] max-w-4xl mx-auto drop-shadow-md">
            Your Next Journey{' '}
            <span className="font-serif-luxury italic font-normal bg-gradient-to-r from-amber-200 via-orange-100 to-amber-300 bg-clip-text text-transparent">
              Begins Here.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-slate-100 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
            Explore extraordinary destinations across India and around the world with Tonfro Solution Tour and Travel.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-1">
            <Link
              href="/packages"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#C25E34] to-[#A74E28] hover:from-[#A74E28] hover:to-[#8E3F1E] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] group"
            >
              <span>Explore Destinations</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/30 hover:border-emerald-400/50 text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Plan Your Trip</span>
            </a>
          </div>

          {/* Authentic Trust Signals */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-7 text-[11px] sm:text-xs font-medium text-slate-200/90 drop-shadow-xs">
            <span className="inline-flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-300" />
              <span>Tailored Domestic & Global Itineraries</span>
            </span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Stays & Transparent Pricing</span>
            </span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="inline-flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-300" />
              <span>Dedicated 24/7 Trip Support</span>
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 3: COMPACT TRIP SEARCH INTERFACE
      ======================================================== */}
      <TripSearchHero />

      {/* ========================================================
          SECTION 4: POPULAR DOMESTIC DESTINATIONS
      ======================================================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C25E34] mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Incredible India</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#0F172A]">
              Popular Domestic Destinations
            </h2>
            <p className="text-sm text-[#64748B] mt-1 max-w-xl">
              Immerse yourself in India’s timeless landscapes, royal palaces, tea plantations, and pristine mountain rivers.
            </p>
          </div>

          <Link
            href="/domestic"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#154D4F] hover:text-[#C25E34] transition-colors"
          >
            <span>View All Domestic Packages ({domesticPackages.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {activeDomesticDestinations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeDomesticDestinations.slice(0, 4).map((dest) => {
              const count = getDestinationPackageCount(dest);
              const destPackages = getDestinationPublishedPackages(dest);
              const minPrice =
                destPackages.length > 0
                  ? Math.min(...destPackages.map((p) => p.startingPriceINR))
                  : dest.startingPriceINR;

              return (
                <Link
                  key={dest.id}
                  href={`/packages?destination=${dest.slug}`}
                  className="group block relative h-96 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#E8E3DA]"
                >
                  <img
                    src={dest.heroImage}
                    alt={dest.name}
                    className="w-full h-full object-cover card-zoom-image"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-white/90 text-[#0F172A] backdrop-blur-sm">
                      {`${count} ${count === 1 ? 'Itinerary' : 'Itineraries'}`}
                    </span>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-[#C58B3E] block mb-1">
                      {dest.stateOrCountry}
                    </span>
                    <h3 className="text-2xl font-serif-luxury font-bold mb-1 leading-snug group-hover:text-[#C58B3E] transition-colors">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-[#E2E8F0] line-clamp-2 mb-3 font-light">
                      {dest.shortDescription}
                    </p>
                    <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs">
                      <span className="text-[#CBD5E1]">Starting From</span>
                      <span className="font-bold text-sm text-white">₹{minPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#E8E3DA] text-[#64748B]">
            <p className="text-sm font-medium">New domestic itineraries are currently being updated.</p>
            <Link href="/contact" className="mt-2 inline-block text-xs font-bold text-[#154D4F] underline">
              Contact our concierge for custom domestic tours
            </Link>
          </div>
        )}
      </section>

      {/* ========================================================
          SECTION 5: POPULAR INTERNATIONAL DESTINATIONS
      ======================================================== */}
      <section className="py-20 bg-[#F5F2EB] border-y border-[#E8E3DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C25E34] mb-2">
                <Compass className="w-3.5 h-3.5" />
                <span>Global Escapes</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#0F172A]">
                Popular International Holidays
              </h2>
              <p className="text-sm text-[#64748B] mt-1 max-w-xl">
                Bespoke European rail journeys, private Balinese pool villas, Arabian desert grandeur, and Vietnamese bays.
              </p>
            </div>

            <Link
              href="/international"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#154D4F] hover:text-[#C25E34] transition-colors"
            >
              <span>View All International Tours ({internationalPackages.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {activeInternationalDestinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {activeInternationalDestinations.slice(0, 4).map((dest) => {
                const count = getDestinationPackageCount(dest);
                const destPackages = getDestinationPublishedPackages(dest);
                const minPrice =
                  destPackages.length > 0
                    ? Math.min(...destPackages.map((p) => p.startingPriceINR))
                    : dest.startingPriceINR;

                return (
                  <Link
                    key={dest.id}
                    href={`/packages?destination=${dest.slug}`}
                    className="group block relative h-96 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#E8E3DA]"
                  >
                    <img
                      src={dest.heroImage}
                      alt={dest.name}
                      className="w-full h-full object-cover card-zoom-image"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                    <div className="absolute top-4 left-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-white/90 text-[#0F172A] backdrop-blur-sm">
                        {`${count} ${count === 1 ? 'Itinerary' : 'Itineraries'}`}
                      </span>
                    </div>

                    <div className="absolute bottom-5 left-5 right-5 text-white">
                      <span className="text-[11px] font-semibold tracking-wider uppercase text-[#C58B3E] block mb-1">
                        {dest.stateOrCountry}
                      </span>
                      <h3 className="text-2xl font-serif-luxury font-bold mb-1 leading-snug group-hover:text-[#C58B3E] transition-colors">
                        {dest.name}
                      </h3>
                      <p className="text-xs text-[#E2E8F0] line-clamp-2 mb-3 font-light">
                        {dest.shortDescription}
                      </p>
                      <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs">
                        <span className="text-[#CBD5E1]">Starting From</span>
                        <span className="font-bold text-sm text-white">₹{minPrice.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-[#E8E3DA] text-[#64748B]">
              <p className="text-sm font-medium">New global itineraries are currently being updated.</p>
              <Link href="/contact" className="mt-2 inline-block text-xs font-bold text-[#154D4F] underline">
                Contact our concierge for custom international tours
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          SECTION 6: FEATURED HOLIDAY PACKAGES
      ======================================================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#154D4F]/10 text-xs font-bold uppercase tracking-wider text-[#154D4F] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C25E34]" />
            <span>Handpicked Signature Packages</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#0F172A] mb-3">
            Curated Journeys of Distinction
          </h2>
          <p className="text-sm text-[#64748B]">
            Meticulously planned day-by-day itineraries featuring confirmed 4-star & boutique accommodations, private vehicles, and unforgettable experiences.
          </p>
        </div>

        {displayPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-6 bg-white rounded-2xl border border-[#E8E3DA] shadow-xs max-w-lg mx-auto space-y-2">
            <p className="text-base font-serif-luxury font-bold text-[#0F172A]">
              No Active Packages Currently Listed
            </p>
            <p className="text-xs text-[#64748B] leading-relaxed">
              New holiday packages are being updated. You can still design a personalized itinerary by contacting our travel desk.
            </p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border-2 border-[#154D4F] text-[#154D4F] hover:bg-[#154D4F] hover:text-white text-xs font-semibold uppercase tracking-wider transition-all"
          >
            <span>Browse Complete Holiday Portfolio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ========================================================
          SECTION 7: TRIP CATEGORIES & THEMES
      ======================================================== */}
      <section className="py-20 bg-[#F5F2EB] border-t border-[#E8E3DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-serif-luxury font-bold text-[#0F172A] mb-2">
              Browse by Travel Experience
            </h2>
            <p className="text-sm text-[#64748B]">
              Whether celebrating a honeymoon, holidaying with multigenerational family, or seeking Himalayan high passes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.title}
                href={`/packages?category=${encodeURIComponent(cat.slug)}`}
                className="group relative h-72 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-[#E8E3DA]"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover card-zoom-image"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-lg font-serif-luxury font-bold mb-1 leading-snug group-hover:text-[#C58B3E] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-[#CBD5E1] line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 8: WHY TRAVEL WITH US (TRUTHFUL & VERIFIABLE)
      ======================================================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C25E34] block mb-2">
            The {agencyConfig.shortName} Difference
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#0F172A] mb-3">
            Why Discerning Travelers Choose Us
          </h2>
          <p className="text-sm text-[#64748B]">
            We operate with absolute transparency, verified hotel allocations, and authentic local partnerships across India and abroad.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {whyChooseUs.map((pillar, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-[#E8E3DA] shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA] flex items-center justify-center mb-4">
                {pillar.icon}
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-2 font-serif-luxury">
                {pillar.title}
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          SECTION 9: CUSTOMER STORIES & EXPERIENCES
      ======================================================== */}
      <section className="py-20 bg-[#FAF8F5] border-t border-[#E8E3DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C25E34] block mb-2">
              Guest Experiences
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#0F172A] mb-3">
              Journeys Told by Our Travelers
            </h2>
            <p className="text-xs text-[#94A3B8]">
              (Demonstration reviews shown until real company feedback is linked)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleTestimonials.map((t) => (
              <div
                key={t.id}
                className="p-6 rounded-2xl bg-white border border-[#E8E3DA] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#C58B3E] mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <p className="text-xs text-[#334155] leading-relaxed italic mb-4">
                    &ldquo;{t.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F1ECE4]">
                  <p className="text-xs font-bold text-[#0F172A]">{t.customerName}</p>
                  <p className="text-[11px] text-[#64748B]">{t.city}</p>
                  <span className="inline-block mt-1 text-[10px] font-medium text-[#C25E34]">
                    {t.tripTitle}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 10: CUSTOM TRIP PLANNING & ENQUIRY FORM
      ======================================================== */}
      <section className="py-24 bg-[#0F1E20] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Callout and Guarantees */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-semibold uppercase tracking-wider text-[#C58B3E] border border-white/15">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bespoke Travel Advisory</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-serif-luxury font-bold leading-tight">
                Let&apos;s Plan Your Next Adventure.
              </h2>

              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Have specific dates in mind, traveling with family or seeking a customized holiday? Share your travel plans with Tonfro Solution Tour and Travel and receive a detailed, personalized itinerary.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1B4D4F] text-[#C58B3E] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      Guaranteed Privacy
                    </h4>
                    <p className="text-xs text-[#94A3B8]">
                      Your telephone number is used solely to share your itinerary. Never sold to call centers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1B4D4F] text-[#C58B3E] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      Fast 2-Hour Working Response
                    </h4>
                    <p className="text-xs text-[#94A3B8]">
                      Our destination curator connects with you directly with realistic hotel choices and route timings.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-[#CBD5E1]">
                <span>Prefer to talk immediately?</span>
                <a
                  href={getPhoneLink()}
                  className="font-bold text-[#C58B3E] hover:underline"
                >
                  Call {agencyConfig.contact.displayPhone}
                </a>
              </div>
            </div>

            {/* Right Column: Interactive Form */}
            <div className="lg:col-span-7 text-[#0F172A]">
              <EnquiryForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
