import React from 'react';
import { Compass, Sparkles, ShieldCheck, Clock, Phone, MessageCircle } from 'lucide-react';
import { agencyConfig, getPhoneLink, getWhatsAppLink } from '@/config/agency';
import EnquiryForm from '@/components/EnquiryForm';

export const metadata = {
  title: 'Plan Your Custom Trip | Tailor-Made Holiday Enquiry',
  description: 'Design your dream holiday with our destination specialists. Custom itineraries for families, couples, and groups across India and global destinations.',
};

export default function PlanYourTripPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#154D4F]/10 text-xs font-bold uppercase tracking-wider text-[#154D4F]">
            <Sparkles className="w-3.5 h-3.5 text-[#C25E34]" />
            <span>Personalized Travel Planning</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-[#0F172A] leading-tight">
            Craft Your Custom Holiday
          </h1>
          <p className="text-sm sm:text-base text-[#64748B]">
            Tell us where you dream of traveling, your group composition, and pace. Our destination curators will prepare a tailored itinerary with confirmed hotel options and realistic timings.
          </p>
        </div>

        {/* Form Container */}
        <div className="mb-14">
          <EnquiryForm />
        </div>

        {/* Trust Badges & Direct Line */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#E8E3DA]">
          <div className="p-5 rounded-xl bg-white border border-[#E8E3DA] text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#FAF8F5] text-[#C25E34] flex items-center justify-center mx-auto">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
              Swift 2-Hour Response
            </h4>
            <p className="text-[11px] text-[#64748B]">
              During business hours, our destination specialists reach out within 120 minutes with initial route recommendations.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-[#E8E3DA] text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#FAF8F5] text-[#C25E34] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
              Transparent Pricing
            </h4>
            <p className="text-[11px] text-[#64748B]">
              Every toll, parking, driver stay, and entry ticket policy is listed clearly. No sudden surprise charges upon arrival.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-[#E8E3DA] text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#FAF8F5] text-emerald-600 flex items-center justify-center mx-auto">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
              WhatsApp Accessibility
            </h4>
            <p className="text-[11px] text-[#64748B]">
              Prefer talking directly right now? Chat with us at{' '}
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-emerald-700 hover:underline"
              >
                {agencyConfig.contact.whatsappDisplay}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
