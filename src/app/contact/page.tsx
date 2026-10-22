import React from 'react';
import { Phone, Mail, MapPin, MessageCircle, Clock, ShieldCheck, HelpCircle } from 'lucide-react';
import { agencyConfig, getPhoneLink, getWhatsAppLink } from '@/config/agency';
import { faqData } from '@/data/faq';
import EnquiryForm from '@/components/EnquiryForm';

export const metadata = {
  title: `Contact Us & Office Locations | ${agencyConfig.companyName}`,
  description: `Get in touch with ${agencyConfig.companyName}. Office addresses in Bengaluru, New Delhi, and Mumbai. Instant WhatsApp and phone assistance.`,
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C25E34] block">
            We Are Here For You
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif-luxury font-bold text-[#0F172A]">
            Contact Our Travel Concierge
          </h1>
          <p className="text-sm sm:text-base text-[#64748B]">
            Have an itinerary question, looking to book a customized holiday, or need urgent on-trip support? Reach us through any of our official channels.
          </p>
        </div>

        {/* 3 Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Phone */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E3DA] shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] text-[#C58B3E] flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A] font-serif-luxury">
              Direct Telephone
            </h3>
            <p className="text-xs text-[#64748B]">
              Speak directly with an available destination specialist.
            </p>
            <div className="pt-2">
              <a
                href={getPhoneLink()}
                className="text-sm font-bold text-[#154D4F] hover:text-[#C25E34] transition-colors block"
              >
                {agencyConfig.contact.displayPhone}
              </a>
              {agencyConfig.contact.secondaryPhone && (
                <span className="text-xs text-[#94A3B8] block mt-0.5">
                  Alt: {agencyConfig.contact.secondaryPhone}
                </span>
              )}
            </div>
          </div>

          {/* Card 2: WhatsApp */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E3DA] shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A] font-serif-luxury">
              Official WhatsApp
            </h3>
            <p className="text-xs text-[#64748B]">
              Fastest way to get day-wise PDF itineraries and quick estimates.
            </p>
            <div className="pt-2">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                <span>{agencyConfig.contact.whatsappDisplay}</span>
                <span>→</span>
              </a>
              <span className="text-xs text-[#94A3B8] block mt-0.5">
                24/7 during ongoing guest tours
              </span>
            </div>
          </div>

          {/* Card 3: Email */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E3DA] shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] text-[#C25E34] flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A] font-serif-luxury">
              Email Desks
            </h3>
            <p className="text-xs text-[#64748B]">
              Send RFP proposals, group bookings, or customer feedback.
            </p>
            <div className="pt-2 space-y-0.5">
              <a
                href={`mailto:${agencyConfig.contact.bookingEmail}`}
                className="text-xs font-semibold text-[#154D4F] hover:text-[#C25E34] transition-colors block"
              >
                {agencyConfig.contact.bookingEmail}
              </a>
              <span className="text-[11px] text-[#94A3B8] block">
                Support: {agencyConfig.contact.supportEmail}
              </span>
            </div>
          </div>
        </div>

        {/* Office Locations & Hours */}
        <div className="bg-white p-8 rounded-2xl border border-[#E8E3DA] shadow-sm space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C25E34] block mb-1">
              Registered Locations
            </span>
            <h2 className="text-2xl font-serif-luxury font-bold text-[#0F172A]">
              Office Addresses & Operating Timings
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Headquarters */}
            <div className="space-y-2 p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA]">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#154D4F]">
                <MapPin className="w-3.5 h-3.5 text-[#C25E34]" />
                <span>Headquarters (Bengaluru)</span>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                {agencyConfig.contact.officeAddress.street}, {agencyConfig.contact.officeAddress.locality},{' '}
                {agencyConfig.contact.officeAddress.city}, {agencyConfig.contact.officeAddress.state} -{' '}
                {agencyConfig.contact.officeAddress.pincode}
              </p>
            </div>

            {/* Branch 1 */}
            {agencyConfig.contact.branchOffices?.[0] && (
              <div className="space-y-2 p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA]">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#154D4F]">
                  <MapPin className="w-3.5 h-3.5 text-[#C25E34]" />
                  <span>{agencyConfig.contact.branchOffices[0].city} Office</span>
                </div>
                <p className="text-xs text-[#475569] leading-relaxed">
                  {agencyConfig.contact.branchOffices[0].address}
                </p>
                <p className="text-xs font-medium text-[#154D4F]">
                  Tel: {agencyConfig.contact.branchOffices[0].phone}
                </p>
              </div>
            )}

            {/* Branch 2 */}
            {agencyConfig.contact.branchOffices?.[1] && (
              <div className="space-y-2 p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA]">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#154D4F]">
                  <MapPin className="w-3.5 h-3.5 text-[#C25E34]" />
                  <span>{agencyConfig.contact.branchOffices[1].city} Office</span>
                </div>
                <p className="text-xs text-[#475569] leading-relaxed">
                  {agencyConfig.contact.branchOffices[1].address}
                </p>
                <p className="text-xs font-medium text-[#154D4F]">
                  Tel: {agencyConfig.contact.branchOffices[1].phone}
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#E8E3DA] flex items-center gap-2 text-xs text-[#64748B]">
            <Clock className="w-4 h-4 text-[#C25E34]" />
            <span>Operating Hours: <strong>{agencyConfig.contact.workingHours}</strong></span>
          </div>
        </div>

        {/* Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C25E34] block">
              Send an Enquiry
            </span>
            <h2 className="text-2xl font-serif-luxury font-bold text-[#0F172A]">
              Tell Us About Your Dream Destination
            </h2>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Fill out the enquiry form and our destination specialist will review your request and get back with a customized plan.
            </p>
            <div className="p-4 rounded-xl bg-white border border-[#E8E3DA] text-xs text-[#475569] space-y-1">
              <p className="font-semibold text-[#0F172A]">Prefer quick messaging?</p>
              <p>You can chat directly with our destination desk anytime on WhatsApp.</p>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C25E34] font-bold hover:underline inline-block mt-1"
              >
                Launch WhatsApp Chat →
              </a>
            </div>
          </div>

          <div className="lg:col-span-8">
            <EnquiryForm />
          </div>
        </div>

        {/* FAQs Accordion / List */}
        <div className="space-y-6 pt-10 border-t border-[#E8E3DA]">
          <div className="text-center max-w-xl mx-auto">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#C25E34] mb-1">
              <HelpCircle className="w-4 h-4" />
              <span>Common Queries</span>
            </div>
            <h2 className="text-3xl font-serif-luxury font-bold text-[#0F172A]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {faqData.map((faq) => (
              <div
                key={faq.id}
                className="p-6 rounded-xl bg-white border border-[#E8E3DA] shadow-2xs space-y-2"
              >
                <h4 className="text-sm font-bold text-[#0F172A] font-serif-luxury">
                  {faq.question}
                </h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
