import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, ShieldCheck, Clock, MapPin, Users, HeartHandshake, Sparkles, MessageCircle, Star, ChevronDown } from 'lucide-react';
import { agencyConfig, getWhatsAppLink, getPhoneLink } from '@/config/agency';
import { destinationsData } from '@/data/destinations';
import { packagesData } from '@/data/packages';
import { sampleTestimonials } from '@/data/testimonials';
import PackageCard from '@/components/PackageCard';
import TripSearchHero from '@/components/TripSearchHero';
import EnquiryForm from '@/components/EnquiryForm';

export default function HomePage() {
  const domesticDestinations = destinationsData.filter((d) => d.type === 'domestic');
  const internationalDestinations = destinationsData.filter((d) => d.type === 'international');
  const featuredPackages = packagesData.filter((p) => p.featured);

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
      icon: <Users className="w-6 h-6 text-[#C25E34]" />,
      title: 'Dedicated 24/7 On-Trip Concierge',
      desc: 'You are connected with a designated trip manager on WhatsApp throughout your entire journey — from airport arrival to farewell.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#C25E34]" />,
      title: 'Zero Hidden Surcharges',
      desc: 'Every fee, toll, driver allowance, and mandatory tax is explicitly clarified in writing before you pay a single rupee.',
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-[#C25E34]" />,
      title: 'Curated Stays & Vetted Chauffeurs',
      desc: 'We personally inspect boutique heritage properties and employ background-verified, licensed drivers who respect your family privacy.',
    },
    {
      icon: <Clock className="w-6 h-6 text-[#C25E34]" />,
      title: '100% Flexible & Handcrafted Pace',
      desc: 'No rushed group bus tours. Your daily sightseeing schedule is customized to your preferred wake-up times and meal choices.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* ========================================================
          SECTION 2: CINEMATIC HERO (Protected Framing & Motion)
      ======================================================== */}
      <section className="relative h-[88vh] min-h-[600px] max-h-[820px] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image / Video Container (Strictly Preserved) */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=2000&q=85"
            alt="Scenic mountain valley in high definition"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F1E20]/90 via-[#0F1E20]/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-transparent opacity-90 h-32 bottom-0" />
        </div>

        {/* Hero Content with Staggered Entrance Motion */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 text-center text-white space-y-6">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs tracking-widest uppercase font-semibold text-[#F3EFEA] shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#C58B3E] animate-float-slow" />
              <span>Handcrafted Holidays • Indian & Global Escapes</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif-luxury font-bold tracking-tight text-white leading-[1.08] max-w-4xl mx-auto animate-fade-in-delay-1">
            Travel That Feels Extraordinary.
          </h1>

          <p className="text-base sm:text-xl text-[#E2E8F0] font-light max-w-2xl mx-auto leading-relaxed animate-fade-in-delay-2">
            From the tranquil pine valleys of Kashmir to the glistening peaks of Switzerland. Unrushed itineraries, verified luxury stays, and dedicated 24/7 care.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 animate-fade-in-delay-3">
            <Link
              href="/packages"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#C25E34] hover:bg-[#A74E28] active:scale-95 text-white text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-lg hover:shadow-2xl"
            >
              <span>Explore Curated Packages</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white backdrop-blur-md border border-white/30 text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-sm"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Instant WhatsApp Advice</span>
            </a>
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
      <section className="py-20 md:py-24 max-w-7xl mx-auto px-4 sm:px-8">
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
            <span>View All Domestic Packages ({domesticDestinations.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {domesticDestinations.slice(0, 4).map((dest) => (
            <Link
              key={dest.id}
              href={`/packages?destination=${dest.slug}`}
              className="group block relative h-96 rounded-2xl overflow-hidden card-hover-lift border border-[#E8E3DA]"
            >
              <img
                src={dest.heroImage}
                alt={dest.name}
                className="w-full h-full object-cover card-zoom-image"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              <div className="absolute top-4 left-4">
                <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-white/95 text-[#0F172A] backdrop-blur-sm shadow-2xs">
                  {dest.packageCount} Itineraries
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
                  <span className="font-bold text-sm text-white">₹{dest.startingPriceINR.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================
          SECTION 5: POPULAR INTERNATIONAL DESTINATIONS
      ======================================================== */}
      <section className="py-20 md:py-24 bg-[#F5F2EB] border-y border-[#E8E3DA]">
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
              <span>View All International Tours ({internationalDestinations.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {internationalDestinations.slice(0, 4).map((dest) => (
              <Link
                key={dest.id}
                href={`/packages?destination=${dest.slug}`}
                className="group block relative h-96 rounded-2xl overflow-hidden card-hover-lift border border-[#E8E3DA]"
              >
                <img
                  src={dest.heroImage}
                  alt={dest.name}
                  className="w-full h-full object-cover card-zoom-image"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-white/95 text-[#0F172A] backdrop-blur-sm shadow-2xs">
                    {dest.packageCount} Itineraries
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
                    <span className="font-bold text-sm text-white">₹{dest.startingPriceINR.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 6: FEATURED HOLIDAY PACKAGES
      ======================================================== */}
      <section className="py-20 md:py-24 max-w-7xl mx-auto px-4 sm:px-8">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border-2 border-[#154D4F] text-[#154D4F] hover:bg-[#154D4F] hover:text-white text-xs font-semibold uppercase tracking-wider transition-all duration-200 active:scale-95"
          >
            <span>Browse Complete Holiday Portfolio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ========================================================
          SECTION 7: TRIP CATEGORIES & THEMES
      ======================================================== */}
      <section className="py-20 md:py-24 bg-[#F5F2EB] border-t border-[#E8E3DA]">
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
                className="group relative h-72 rounded-xl overflow-hidden card-hover-lift border border-[#E8E3DA]"
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
      <section className="py-20 md:py-24 max-w-7xl mx-auto px-4 sm:px-8">
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
              className="p-6 rounded-2xl bg-white border border-[#E8E3DA] card-hover-lift"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA] flex items-center justify-center mb-4 text-[#C25E34]">
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
      <section className="py-20 md:py-24 bg-[#FAF8F5] border-t border-[#E8E3DA]">
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
                className="p-6 rounded-2xl bg-white border border-[#E8E3DA] card-hover-lift flex flex-col justify-between"
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
                Plan Your Private Journey With Our Specialists
              </h2>

              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Have specific dates in mind, traveling with elderly parents or seeking a private helicopter transfer? Share your preferences and receive an unhurried, day-wise proposal.
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
            <div className="lg:col-span-7">
              <EnquiryForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
