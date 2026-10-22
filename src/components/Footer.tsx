'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Phone, Mail, MapPin, MessageCircle, ShieldCheck, Heart, Lock } from 'lucide-react';
import { agencyConfig, getWhatsAppLink, getPhoneLink } from '@/config/agency';

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="bg-[#0F1E20] text-[#E2E8F0] border-t border-[#1B4D4F]/50 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#1E3A3C]">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#C25E34] flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-serif-luxury font-bold tracking-tight text-white block">
                  {agencyConfig.companyName}
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-[#C58B3E] block">
                  Curated Travel Experiences
                </span>
              </div>
            </Link>

            <p className="text-sm text-[#94A3B8] leading-relaxed max-w-sm">
              {agencyConfig.description}
            </p>

            <div className="p-3.5 rounded-lg bg-[#152D30] border border-[#214346] text-xs text-[#CBD5E1] space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-[#C58B3E]">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Travel Operator</span>
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-normal">
                {agencyConfig.accreditations.trustNote}. Operating from Pitampura, New Delhi.
              </p>
            </div>
          </div>

          {/* Quick Journeys */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#C58B3E] mb-4">
              Explore India
            </h4>
            <ul className="space-y-2.5 text-sm text-[#94A3B8]">
              <li>
                <Link href="/packages?destination=kashmir" className="hover:text-white transition-colors">
                  Kashmir Valley & Gulmarg
                </Link>
              </li>
              <li>
                <Link href="/packages?destination=kerala" className="hover:text-white transition-colors">
                  Kerala Backwaters & Munnar
                </Link>
              </li>
              <li>
                <Link href="/packages?destination=rajasthan" className="hover:text-white transition-colors">
                  Royal Rajasthan Forts
                </Link>
              </li>
              <li>
                <Link href="/packages?destination=ladakh" className="hover:text-white transition-colors">
                  Ladakh & Pangong Tso
                </Link>
              </li>
              <li>
                <Link href="/domestic" className="text-[#C58B3E] hover:underline font-medium inline-block mt-1">
                  View All Domestic →
                </Link>
              </li>
            </ul>
          </div>

          {/* Global Journeys */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#C58B3E] mb-4">
              Global Destinations
            </h4>
            <ul className="space-y-2.5 text-sm text-[#94A3B8]">
              <li>
                <Link href="/packages?destination=switzerland" className="hover:text-white transition-colors">
                  Swiss Alps & Jungfraujoch
                </Link>
              </li>
              <li>
                <Link href="/packages?destination=bali" className="hover:text-white transition-colors">
                  Bali Private Pool Villas
                </Link>
              </li>
              <li>
                <Link href="/packages?destination=dubai" className="hover:text-white transition-colors">
                  Dubai Skyline & Desert Safari
                </Link>
              </li>
              <li>
                <Link href="/packages?destination=vietnam" className="hover:text-white transition-colors">
                  Vietnam & Ha Long Bay
                </Link>
              </li>
              <li>
                <Link href="/international" className="text-[#C58B3E] hover:underline font-medium inline-block mt-1">
                  View All International →
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Office & Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#C58B3E] mb-4">
              Contact & Desk
            </h4>
            <ul className="space-y-3 text-xs text-[#CBD5E1]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C25E34] shrink-0 mt-0.5" />
                <span>
                  {agencyConfig.contact.officeAddress.street}, {agencyConfig.contact.officeAddress.locality},{' '}
                  {agencyConfig.contact.officeAddress.city}, {agencyConfig.contact.officeAddress.country}
                </span>
              </li>
              <li>
                <a href={getPhoneLink()} className="flex items-center gap-2.5 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-[#C58B3E] shrink-0" />
                  <span className="font-medium text-sm">{agencyConfig.contact.displayPhone}</span>
                </a>
              </li>
              <li>
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>WhatsApp: {agencyConfig.contact.whatsappDisplay}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${agencyConfig.contact.email}`} className="flex items-center gap-2.5 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 text-[#94A3B8] shrink-0" />
                  <span>{agencyConfig.contact.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar with copyright and sample disclosure */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <span>© {currentYear} {agencyConfig.legalEntityName}. All rights reserved.</span>
            <Link
              href="/admin"
              title="Staff Console"
              className="opacity-15 hover:opacity-80 transition-opacity text-slate-400 inline-flex items-center"
            >
              <Lock className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/about" className="hover:text-white transition-colors">
              About Us
            </Link>
            <span>•</span>
            <Link href="/plan-your-trip" className="hover:text-white transition-colors">
              Custom Itinerary
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact & Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
