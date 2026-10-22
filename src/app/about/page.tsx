import React from 'react';
import Link from 'next/link';
import { Compass, ShieldCheck, Heart, Award, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { agencyConfig, getPhoneLink, getWhatsAppLink } from '@/config/agency';

export const metadata = {
  title: `About Us | ${agencyConfig.companyName}`,
  description: `Discover the philosophy, travel curators, and transparent holiday standards behind ${agencyConfig.companyName}.`,
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C25E34] block">
            Our Philosophy
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif-luxury font-bold text-[#0F172A] leading-tight">
            Journeys Designed With Respect for Your Time & Comfort
          </h1>
          <p className="text-base sm:text-lg text-[#64748B] leading-relaxed">
            {agencyConfig.description}
          </p>
        </div>

        {/* Company Profile Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E8E3DA] shadow-xs space-y-3">
          <div className="flex items-center gap-2 font-bold text-[#154D4F] text-base font-serif-luxury">
            <ShieldCheck className="w-5 h-5 text-[#C25E34]" />
            <span>Tonfro Solution Tour and Travel — New Delhi</span>
          </div>
          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
            Headquartered at Vats Market, Pitampura, New Delhi, <strong>Tonfro Solution Tour and Travel</strong> was founded to provide transparent, reliable, and thoughtful travel planning for families, couples, group departures, and independent explorers. Whether you are discovering the scenic hills and heritage of India or embarking on an international adventure, our dedicated team crafts itineraries with care, verified accommodations, and round-the-clock support.
          </p>
        </div>

        {/* Visual Story Banner */}
        <div className="relative h-96 rounded-2xl overflow-hidden shadow-md">
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=80"
            alt="Scenic mountain journey"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#C58B3E] block mb-1">
              Established {agencyConfig.establishedYear}
            </span>
            <h3 className="text-2xl font-serif-luxury font-bold mb-2">
              Unrushed Travel. Verified Quality.
            </h3>
            <p className="text-xs text-[#E2E8F0] leading-relaxed">
              We started with a simple belief: Indian families and modern travelers deserve holiday itineraries that balance iconic sightseeing with genuine moments of rest and peace.
            </p>
          </div>
        </div>

        {/* Core Principles */}
        <div className="space-y-6">
          <h2 className="text-3xl font-serif-luxury font-bold text-[#0F172A]">
            The 4 Pillars of Our Travel Promise
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-white border border-[#E8E3DA] shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] text-[#C25E34] flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="text-base font-bold text-[#0F172A] font-serif-luxury">
                Curated, Not Aggregated
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                We do not dump thousands of unvetted third-party packages. Every hotel category, houseboat tier, and road transfer is inspected to ensure sanitary, premium conditions.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[#E8E3DA] shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] text-[#C25E34] flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="text-base font-bold text-[#0F172A] font-serif-luxury">
                Truthful & Transparent Pricing
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                We will never quote an artificially low price and then tack on mandatory driver fees, AC charges, or seasonal tolls upon arrival. What we quote is what you pay.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[#E8E3DA] shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] text-[#C25E34] flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="text-base font-bold text-[#0F172A] font-serif-luxury">
                Dedicated Concierge on WhatsApp
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Our guests are never passed around anonymous call centers. You have the direct WhatsApp contact of your designated tour supervisor from start to finish.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[#E8E3DA] shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] text-[#C25E34] flex items-center justify-center font-bold">
                04
              </div>
              <h3 className="text-base font-bold text-[#0F172A] font-serif-luxury">
                Responsible & Fair Local Partnerships
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                We work directly with local Kashmiri shikara owners, Himachali guides, Balinese drivers, and Swiss rail partners, guaranteeing fair wages and genuine hospitality.
              </p>
            </div>
          </div>
        </div>

        {/* CTA to Plan Trip */}
        <div className="p-8 sm:p-12 rounded-2xl bg-[#154D4F] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-serif-luxury font-bold">
              Ready to Design Your Next Unforgettable Journey?
            </h3>
            <p className="text-xs sm:text-sm text-[#CBD5E1]">
              Speak directly with our destination experts or browse our signature holiday collection.
            </p>
          </div>
          <Link
            href="/plan-your-trip"
            className="shrink-0 px-6 py-3.5 rounded-xl bg-[#C25E34] hover:bg-[#A74E28] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md"
          >
            Start Planning
          </Link>
        </div>
      </div>
    </div>
  );
}
