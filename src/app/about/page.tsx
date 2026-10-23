import React from 'react';
import Link from 'next/link';
import {
  Compass,
  Plane,
  Sparkles,
  Users,
  HeartHandshake,
  Target,
  PlaneTakeoff,
  Building2,
  Ship,
  FileText,
  Eye,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { agencyConfig, getPhoneLink, getWhatsAppLink } from '@/config/agency';

export const metadata = {
  title: `About Us | ${agencyConfig.companyName}`,
  description: `${agencyConfig.companyName} helps travellers plan memorable journeys across India and international destinations. Explore our mission, vision, and comprehensive travel services.`,
};

const travelServices = [
  {
    title: 'Domestic Holiday Packages',
    icon: Compass,
    href: '/domestic',
  },
  {
    title: 'International Tour Packages',
    icon: Plane,
    href: '/international',
  },
  {
    title: 'Honeymoon Packages',
    icon: Sparkles,
    href: '/packages?tag=honeymoon',
  },
  {
    title: 'Family Holiday Packages',
    icon: Users,
    href: '/packages?tag=family',
  },
  {
    title: 'Group Tours',
    icon: HeartHandshake,
    href: '/packages?tag=group',
  },
  {
    title: 'Customized Travel Planning',
    icon: Target,
    href: '/plan-your-trip',
  },
  {
    title: 'Flight Booking Assistance',
    icon: PlaneTakeoff,
    href: '/contact',
  },
  {
    title: 'Hotel Booking Assistance',
    icon: Building2,
    href: '/contact',
  },
  {
    title: 'Cruise Holidays',
    icon: Ship,
    href: '/packages?tag=cruise',
  },
  {
    title: 'Visa Assistance',
    icon: FileText,
    href: '/contact',
  },
];

const pillars = [
  {
    number: '01',
    title: 'Curated, Not Aggregated',
    description:
      'We do not dump thousands of unvetted third-party packages. Every hotel category, houseboat tier, and road transfer is inspected to ensure sanitary, premium conditions.',
  },
  {
    number: '02',
    title: 'Truthful & Transparent Pricing',
    description:
      'We will never quote an artificially low price and then tack on mandatory driver fees, AC charges, or seasonal tolls upon arrival. What we quote is what you pay.',
  },
  {
    number: '03',
    title: 'Dedicated Concierge on WhatsApp',
    description:
      'Our guests are never passed around anonymous call centers. You have the direct WhatsApp contact of your designated tour supervisor from start to finish.',
  },
  {
    number: '04',
    title: 'Responsible & Fair Local Partnerships',
    description:
      'We work directly with local Kashmiri shikara owners, Himachali guides, Balinese drivers, and Swiss rail partners, guaranteeing fair wages and genuine hospitality.',
  },
];

export default function AboutPage() {
  const companyUpper = agencyConfig.companyName.toUpperCase();

  return (
    <div className="min-h-screen bg-white">
      {/* SECTION 1: ABOUT US HERO + MISSION & VISION */}
      <section className="pt-12 pb-16 sm:pt-16 sm:pb-20 border-b border-[#EEF2F6]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Eyebrow */}
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#0D7C85] block mb-3">
            ABOUT US
          </span>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif-luxury font-bold text-[#0F2942] tracking-tight uppercase leading-[1.15] mb-6">
            {companyUpper}
          </h1>

          {/* Intro Description */}
          <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-4xl mb-10 sm:mb-12">
            {companyUpper} helps travellers plan memorable journeys across India and
            international destinations. We aim to make travel planning convenient by helping
            customers explore destinations, discover holiday options, and organize trips according
            to their preferences, interests, and budget.
          </p>

          {/* Mission & Vision Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Our Mission Card */}
            <div className="rounded-2xl sm:rounded-3xl bg-[#F4F8FA] border border-[#E2EAF0] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xs">
              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-[#DFEAF0] shadow-2xs flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-[#0D7C85]" strokeWidth={2.2} />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#0F2942]">
                    Our Mission
                  </h2>
                </div>
                <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                  Our mission is to make travel planning simpler, more convenient, and more enjoyable
                  by helping customers find suitable travel experiences for holidays, family
                  vacations, honeymoons, and international adventures.
                </p>
              </div>
            </div>

            {/* Our Vision Card */}
            <div className="rounded-2xl sm:rounded-3xl bg-[#F4F8FA] border border-[#E2EAF0] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xs">
              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-[#DFEAF0] shadow-2xs flex items-center justify-center shrink-0">
                    <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-[#0D7C85]" strokeWidth={2.2} />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#0F2942]">
                    Our Vision
                  </h2>
                </div>
                <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                  Our vision is to become a trusted choice for travellers by focusing on customer
                  satisfaction, personalized travel planning, transparent communication, and
                  memorable travel experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: COMPREHENSIVE SUPPORT / OUR TRAVEL SERVICES */}
      <section className="py-16 sm:py-20 border-b border-[#EEF2F6]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Eyebrow */}
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#0D7C85] block mb-3">
            COMPREHENSIVE SUPPORT
          </span>

          {/* Section Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F2942] tracking-tight mb-8 sm:mb-10">
            Our Travel Services
          </h2>

          {/* 10 Services Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5">
            {travelServices.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.title}
                  href={service.href}
                  className="rounded-2xl p-4 sm:p-6 bg-[#F4F8FA] border border-[#E2EAF0] flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-white hover:border-[#0D7C85]/30 hover:shadow-md hover:-translate-y-1 group"
                >
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-[#DFEAF0] shadow-2xs flex items-center justify-center text-[#0D7C85] mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#0D7C85]" strokeWidth={2} />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#0F2942] leading-snug group-hover:text-[#0D7C85] transition-colors">
                    {service.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: STORY & HERITAGE BANNER */}
      <section className="py-16 sm:py-20 bg-[#FAF8F5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Visual Story Banner */}
          <div className="relative h-80 sm:h-96 rounded-2xl sm:rounded-3xl overflow-hidden shadow-md">
            <img
              src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=80"
              alt="Scenic mountain journey"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 text-white max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C58B3E] block mb-2">
                Established {agencyConfig.establishedYear} • New Delhi
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold mb-2">
                Unrushed Travel. Verified Quality.
              </h3>
              <p className="text-xs sm:text-sm text-[#E2E8F0] leading-relaxed">
                We started with a simple belief: Indian families and modern travelers deserve holiday
                itineraries that balance iconic sightseeing with genuine moments of rest and peace.
              </p>
            </div>
          </div>

          {/* Registered Office & Credentials Card */}
          <div className="rounded-2xl sm:rounded-3xl bg-white border border-[#E2EAF0] p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#EEF2F6]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0D7C85]/10 flex items-center justify-center text-[#0D7C85]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-luxury font-bold text-[#0F2942] text-lg sm:text-xl">
                    {agencyConfig.companyName}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    {agencyConfig.accreditations.registeredAgencyBadgeText}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={getPhoneLink()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D7C85] text-white text-xs font-semibold hover:bg-[#0A646B] transition-colors shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {agencyConfig.contact.displayPhone}</span>
                </a>
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] text-white text-xs font-semibold hover:bg-[#1EBE5D] transition-colors shadow-2xs"
                >
                  <span>WhatsApp Concierge</span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#0D7C85] shrink-0 mt-0.5" />
                <div className="text-xs text-[#475569] leading-relaxed">
                  <p className="font-semibold text-[#0F2942] mb-0.5">Headquarters</p>
                  <p>{agencyConfig.contact.officeAddress.street}</p>
                  <p>
                    {agencyConfig.contact.officeAddress.locality},{' '}
                    {agencyConfig.contact.officeAddress.city} –{' '}
                    {agencyConfig.contact.officeAddress.pincode}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#0D7C85] shrink-0 mt-0.5" />
                <div className="text-xs text-[#475569] leading-relaxed">
                  <p className="font-semibold text-[#0F2942] mb-0.5">Direct Enquiries</p>
                  <p>{agencyConfig.contact.email}</p>
                  <p className="text-[#64748B]">Available for domestic & international bookings</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#0D7C85] shrink-0 mt-0.5" />
                <div className="text-xs text-[#475569] leading-relaxed">
                  <p className="font-semibold text-[#0F2942] mb-0.5">Office Hours</p>
                  <p>{agencyConfig.contact.workingHours}</p>
                  <p className="text-[#64748B]">Emergency 24x7 support for on-tour travellers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: THE 4 PILLARS OF OUR TRAVEL PROMISE */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#0D7C85] block mb-2">
              OUR PROMISE
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#0F2942]">
              The 4 Pillars of Our Travel Promise
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((pillar) => (
              <div
                key={pillar.number}
                className="p-6 sm:p-8 rounded-2xl bg-[#F4F8FA] border border-[#E2EAF0] space-y-3 transition-all duration-300 hover:shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-[#DFEAF0] text-[#0D7C85] flex items-center justify-center font-bold text-sm shadow-2xs">
                  {pillar.number}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#0F2942] font-serif-luxury">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="p-8 sm:p-12 rounded-2xl sm:rounded-3xl bg-[#0F2942] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md mt-10">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold">
                Ready to Design Your Next Unforgettable Journey?
              </h3>
              <p className="text-xs sm:text-sm text-[#CBD5E1] max-w-xl">
                Speak directly with our destination experts or plan a custom itinerary tailored to
                your family, dates, and budget.
              </p>
            </div>
            <Link
              href="/plan-your-trip"
              className="shrink-0 px-6 py-3.5 rounded-xl bg-[#0D7C85] hover:bg-[#0A646B] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
            >
              <span>Start Planning</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
