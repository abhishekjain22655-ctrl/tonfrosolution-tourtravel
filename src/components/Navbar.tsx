'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MessageCircle, Menu, X, Compass, ChevronDown, ShieldCheck } from 'lucide-react';
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
      <div className="bg-[#154D4F] text-[#FAF8F5]/90 text-xs py-2 px-4 sm:px-8 border-b border-[#FAF8F5]/10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FAF8F5]/15 text-[11px] font-medium tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C58B3E]" />
              {agencyConfig.accreditations.registeredAgencyBadgeText}
            </span>
            <span className="hidden md:inline text-[#FAF8F5]/60">•</span>
            <span className="hidden md:inline text-[#FAF8F5]/80">
              {agencyConfig.contact.workingHours}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href={getPhoneLink()}
              className="flex items-center gap-1.5 hover:text-[#C58B3E] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#C58B3E]" />
              <span className="font-medium">{agencyConfig.contact.displayPhone}</span>
            </a>
            <span className="text-[#FAF8F5]/40">|</span>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-300 hover:text-emerald-200 transition-colors font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Us</span>
            </a>
            <span className="text-[#FAF8F5]/40">|</span>
            <Link
              href="/admin"
              className="text-[#FAF8F5]/60 hover:text-[#FAF8F5] transition-colors text-[11px]"
            >
              Staff Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'glass-nav shadow-md py-3 border-b border-[#E8E3DA]'
            : 'bg-[#FAF8F5] py-4 border-b border-[#E8E3DA]/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          {/* Logo / Brand Name */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-[#154D4F] flex items-center justify-center text-[#FAF8F5] shadow-sm group-hover:bg-[#C25E34] transition-colors">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-serif-luxury font-bold tracking-tight text-[#0F172A] block leading-none">
                {agencyConfig.companyName}
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#C25E34] block mt-0.5">
                Indian & International Journeys
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors relative py-1 ${
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
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/plan-your-trip"
              className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#C25E34] hover:bg-[#A74E28] rounded-md transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Plan Custom Trip
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
