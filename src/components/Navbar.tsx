'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MessageCircle, Menu, X, Compass, ChevronDown, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { agencyConfig, getWhatsAppLink, getPhoneLink } from '@/config/agency';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Domestic Holidays', href: '/domestic' },
    { name: 'International Tours', href: '/international' },
    { name: 'All Packages', href: '/packages' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top micro-bar for trust, hours, & direct call */}
      <div className="bg-[#0E3638] text-[#FAF8F5]/90 text-[11px] py-2 px-4 sm:px-8 border-b border-[#FAF8F5]/10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[#F3EFEA] text-[11px] font-medium tracking-wide border border-white/10 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C58B3E]" />
              <span>{agencyConfig.accreditations.registeredAgencyBadgeText}</span>
            </span>
            <span className="hidden lg:inline text-white/30">•</span>
            <span className="hidden lg:inline text-[#FAF8F5]/75">
              {agencyConfig.contact.workingHours}
            </span>
          </div>

          <div className="flex items-center gap-3.5 text-xs">
            <a
              href={getPhoneLink()}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full hover:bg-white/10 text-[#FAF8F5] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#C58B3E]" />
              <span className="font-medium tracking-wide text-[11px]">{agencyConfig.contact.displayPhone}</span>
            </a>

            <span className="text-white/20">|</span>

            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-all font-semibold text-[11px] border border-emerald-400/30"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp Us</span>
            </a>

            <span className="text-white/20">|</span>

            <Link
              href="/admin"
              className="text-[#FAF8F5]/60 hover:text-white transition-colors text-[11px] font-medium"
            >
              Staff Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        className={`w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-[#FAF8F5] shadow-xs py-3 border-b border-[#E8E3DA]'
            : 'bg-[#FAF8F5] py-3.5 border-b border-[#E8E3DA]/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-4 xl:gap-8">
          {/* Logo / Brand Name */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#154D4F] to-[#0E3638] flex items-center justify-center text-[#FAF8F5] shadow-sm group-hover:from-[#C25E34] group-hover:to-[#A74E28] transition-all duration-300 border border-white/10 shrink-0">
              <Compass className="w-5 h-5 text-amber-200/90 group-hover:rotate-45 transition-transform duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-serif-luxury font-bold tracking-tight text-[#0F172A] block leading-tight whitespace-nowrap">
                Tonfro Solution
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#C25E34] block whitespace-nowrap">
                Tour and Travel
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-6 whitespace-nowrap">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs xl:text-sm font-medium transition-colors relative py-1.5 ${
                  isActive(link.href)
                    ? 'text-[#C25E34] font-semibold'
                    : 'text-[#1E293B] hover:text-[#C25E34]'
                }`}
              >
                {link.name}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C25E34] rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <Link
              href="/plan-your-trip"
              className="inline-flex items-center justify-center gap-2 px-4 xl:px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#C25E34] to-[#A74E28] hover:from-[#A74E28] hover:to-[#8E3F1E] rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:translate-y-[-1px] group whitespace-nowrap"
            >
              <span>Plan Custom Trip</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#0F172A] hover:text-[#C25E34] rounded-md focus:outline-none focus:ring-2 focus:ring-[#C25E34]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[98px] bottom-0 bg-[#FAF8F5] z-50 px-6 py-6 border-t border-[#E8E3DA] overflow-y-auto flex flex-col justify-between">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-widest font-semibold text-[#64748B] mb-2">
              Explore Journeys
            </p>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-lg font-serif-luxury py-2 border-b border-[#E8E3DA]/60 ${
                  isActive(link.href)
                    ? 'text-[#C25E34] font-bold'
                    : 'text-[#0F172A] hover:text-[#C25E34]'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-4 space-y-3">
              <Link
                href="/plan-your-trip"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center block px-5 py-3 text-sm font-semibold uppercase tracking-wider text-white bg-[#C25E34] rounded-md"
              >
                Plan Custom Trip
              </Link>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center block px-5 py-3 text-sm font-semibold uppercase tracking-wider text-emerald-950 bg-emerald-100 border border-emerald-300 rounded-md"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[#E8E3DA] text-xs text-[#64748B] space-y-1">
            <p className="font-medium text-[#0F172A]">{agencyConfig.companyName}</p>
            <p>Direct Call: {agencyConfig.contact.displayPhone}</p>
            <p>{agencyConfig.contact.officeAddress.city}, {agencyConfig.contact.officeAddress.country}</p>
          </div>
        </div>
      )}
    </header>
  );
}
