'use client';

import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { agencyConfig, getWhatsAppLink, getPhoneLink } from '@/config/agency';

export default function FloatingActionButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* Click to Call Button */}
      <a
        href={getPhoneLink()}
        className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#FAF8F5] text-[#0F172A] border border-[#E8E3DA] shadow-lg hover:shadow-xl hover:bg-white transition-all transform hover:-translate-y-0.5 group"
        aria-label="Call our travel specialists"
      >
        <div className="w-8 h-8 rounded-full bg-[#154D4F] text-white flex items-center justify-center group-hover:bg-[#C25E34] transition-colors">
          <Phone className="w-4 h-4" />
        </div>
        <div className="hidden sm:block text-left pr-1">
          <span className="block text-[10px] uppercase font-semibold tracking-wider text-[#64748B]">
            Call Concierge
          </span>
          <span className="block text-xs font-bold text-[#0F172A]">
            {agencyConfig.contact.displayPhone}
          </span>
        </div>
      </a>

      {/* Floating WhatsApp Action Button */}
      <a
        href={getWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 group"
        aria-label="Chat with our destination experts on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 text-white animate-pulse" />
        <span className="text-xs font-bold tracking-wide">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
}
