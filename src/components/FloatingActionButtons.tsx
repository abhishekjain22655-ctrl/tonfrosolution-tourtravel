'use client';

import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { agencyConfig, getWhatsAppLink, getPhoneLink } from '@/config/agency';

export default function FloatingActionButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
      {/* Click to Call Button */}
      <a
        href={getPhoneLink()}
        className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-md text-[#0F172A] border border-[#E8E3DA] shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-xl hover:bg-white transition-all duration-200 transform hover:-translate-y-0.5 group"
        aria-label="Call our travel specialists"
      >
        <div className="w-8 h-8 rounded-full bg-[#154D4F] text-white flex items-center justify-center group-hover:bg-[#C25E34] transition-colors shadow-2xs">
          <Phone className="w-3.5 h-3.5" />
        </div>
        <div className="hidden sm:block text-left pr-1.5">
          <span className="block text-[9px] uppercase font-bold tracking-wider text-[#64748B]">
            Call Concierge
          </span>
          <span className="block text-xs font-bold text-[#0F172A]">
            {agencyConfig.contact.displayPhone}
          </span>
        </div>
      </a>

      {/* Floating WhatsApp Action Button with Live Pulse Dot */}
      <a
        href={getWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-[0_8px_30px_rgb(5,150,105,0.35)] hover:shadow-[0_12px_35px_rgb(5,150,105,0.45)] transition-all duration-200 transform hover:-translate-y-1 group"
        aria-label="Chat with our destination experts on WhatsApp"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 text-white" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-300 ring-2 ring-emerald-600 animate-ping" />
        </div>
        <div className="text-left">
          <span className="block text-[9px] uppercase font-bold tracking-wider text-emerald-100/90 leading-none mb-0.5">
            Online Now
          </span>
          <span className="block text-xs font-bold tracking-wide leading-none">
            Chat on WhatsApp
          </span>
        </div>
      </a>
    </div>
  );
}
