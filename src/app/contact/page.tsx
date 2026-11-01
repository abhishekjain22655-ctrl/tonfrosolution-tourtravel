import { Phone, Mail, MapPin, MessageCircle, Clock, ShieldCheck, HelpCircle, ExternalLink, Navigation } from 'lucide-react';
import { agencyConfig, getPhoneLink, getWhatsAppLink } from '@/config/agency';
import { faqData } from '@/data/faq';
import EnquiryForm from '@/components/EnquiryForm';

export const metadata = {
  title: `Contact Us & Head Office | ${agencyConfig.companyName}`,
  description: `Get in touch with ${agencyConfig.companyName}. Office address in Pitampura, New Delhi. Official phone: ${agencyConfig.contact.displayPhone}, Email: ${agencyConfig.contact.email}.`,
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
            Have an itinerary question, looking to book a customized holiday, or need travel support? Reach us through any of our official channels.
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
              <span className="text-xs text-[#94A3B8] block mt-0.5">
                Official Support Line
              </span>
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
              Fastest way to get day-wise itineraries, quotes, and quick answers.
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
                Quick responses during business hours
              </span>
            </div>
          </div>

          {/* Card 3: Email */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E3DA] shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] text-[#C25E34] flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A] font-serif-luxury">
              Official Email
            </h3>
            <p className="text-xs text-[#64748B]">
              Send itinerary enquiries, corporate travel requests, or questions.
            </p>
            <div className="pt-2 space-y-0.5">
              <a
                href={`mailto:${agencyConfig.contact.email}`}
                className="text-xs font-semibold text-[#154D4F] hover:text-[#C25E34] transition-colors block break-all"
              >
                {agencyConfig.contact.email}
              </a>
              <span className="text-[11px] text-[#94A3B8] block">
                Response within 24 business hours
              </span>
            </div>
          </div>
        </div>

        {/* Office Location, Timings & Interactive Google Map */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E3DA] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C25E34] block mb-1">
                Visit Our Office
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0F172A]">
                Head Office Location & Timings
              </h2>
            </div>
            {agencyConfig.contact.officeAddress.mapDirectionUrl && (
              <a
                href={agencyConfig.contact.officeAddress.mapDirectionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#154D4F] hover:bg-[#C25E34] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-xs hover:shadow-md shrink-0"
              >
                <Navigation className="w-4 h-4 text-amber-300" />
                <span>Get Directions on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Headquarters Card */}
            <div className="space-y-3 p-5 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA]">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#154D4F]">
                <MapPin className="w-4 h-4 text-[#C25E34]" />
                <span>Registered Office — Pitampura, New Delhi</span>
              </div>
              <p className="text-xs text-[#334155] leading-relaxed">
                {agencyConfig.contact.officeAddress.street}, {agencyConfig.contact.officeAddress.locality},{' '}
                {agencyConfig.contact.officeAddress.city}, {agencyConfig.contact.officeAddress.state} –{' '}
                {agencyConfig.contact.officeAddress.pincode}, {agencyConfig.contact.officeAddress.country}
              </p>
              {agencyConfig.contact.officeAddress.landmark && (
                <p className="text-xs font-medium text-[#C25E34]">
                  Landmark: {agencyConfig.contact.officeAddress.landmark}
                </p>
              )}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
                <a
                  href={getPhoneLink()}
                  className="font-semibold text-[#154D4F] hover:text-[#C25E34] inline-flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C58B3E]" />
                  <span>{agencyConfig.contact.displayPhone}</span>
                </a>
                <span className="text-[#CBD5E1]">|</span>
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Concierge</span>
                </a>
              </div>
            </div>

            {/* Hours & Appointments */}
            <div className="space-y-3 p-5 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA]">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#154D4F]">
                <Clock className="w-4 h-4 text-[#C25E34]" />
                <span>Working Hours & Consultations</span>
              </div>
              <p className="text-xs text-[#334155] leading-relaxed">
                <strong>Business Hours:</strong> Monday – Saturday: 9:30 AM to 7:00 PM IST
              </p>
              <p className="text-xs text-[#64748B]">
                Sunday: Closed for walk-in office visits. 24/7 dedicated telephone and WhatsApp support remains active for on-tour travellers.
              </p>
              <p className="text-xs text-[#154D4F] font-medium pt-1">
                For in-person holiday planning sessions at our Pitampura office, prior appointment booking is welcomed.
              </p>
            </div>
          </div>

          {/* Interactive Google Map Embed */}
          {agencyConfig.contact.officeAddress.mapEmbedUrl && (
            <div className="space-y-2 pt-2">
              <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border border-[#E8E3DA] shadow-inner bg-slate-100">
                <iframe
                  title="Tonfro Solution Tour and Travel - Head Office Location Map"
                  src={agencyConfig.contact.officeAddress.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 px-2 text-xs text-[#64748B]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C25E34] shrink-0" />
                  <span className="font-medium text-[#1E293B]">
                    Office No. 304, Third Floor, Khasra No. 502/348, Vats Market, Pitampura Village, New Delhi – 110034
                  </span>
                </div>
                {agencyConfig.contact.officeAddress.mapDirectionUrl && (
                  <a
                    href={agencyConfig.contact.officeAddress.mapDirectionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#154D4F] hover:text-[#C25E34] transition-colors inline-flex items-center gap-1"
                  >
                    <span>Open full view in Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* LocalBusiness Schema for Contact Page */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'ContactPage',
                name: `Contact & Office Location | ${agencyConfig.companyName}`,
                description: `Head office address, map location and contact info for ${agencyConfig.companyName} in Pitampura, New Delhi.`,
                mainEntity: {
                  '@type': 'TravelAgency',
                  name: agencyConfig.companyName,
                  telephone: agencyConfig.contact.primaryPhone,
                  email: agencyConfig.contact.email,
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: agencyConfig.contact.officeAddress.street,
                    addressLocality: agencyConfig.contact.officeAddress.city,
                    addressRegion: agencyConfig.contact.officeAddress.state,
                    postalCode: agencyConfig.contact.officeAddress.pincode,
                    addressCountry: 'IN',
                  },
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: '28.6989',
                    longitude: '77.1384',
                  },
                  hasMap: agencyConfig.contact.officeAddress.mapDirectionUrl,
                  openingHoursSpecification: [
                    {
                      '@type': 'OpeningHoursSpecification',
                      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                      opens: '09:30',
                      closes: '19:00',
                    },
                  ],
                },
              }),
            }}
          />
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
