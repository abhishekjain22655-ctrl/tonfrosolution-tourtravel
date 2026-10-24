'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Phone, MessageCircle, Calendar, Users, MapPin, Sparkles } from 'lucide-react';
import { saveNewEnquiry } from '@/lib/storage';
import { agencyConfig, getWhatsAppLink } from '@/config/agency';

export const budgetOptions = [
  'Under ₹35,000',
  '₹35,000 - ₹75,000',
  '₹75,000 - ₹1,50,000',
  '₹1,50,000 - ₹3,00,000',
  '₹3,00,000 - ₹5,00,000',
  '₹5,00,000+ (Luxury & Bespoke)',
] as const;

interface EnquiryFormProps {
  originPackageSlug?: string;
  originPackageTitle?: string;
  defaultDestination?: string;
  defaultTripType?: 'domestic' | 'international';
  defaultBudget?: string;
  onSuccess?: () => void;
}

export default function EnquiryForm({
  originPackageSlug,
  originPackageTitle,
  defaultDestination = '',
  defaultTripType = 'domestic',
  defaultBudget,
  onSuccess,
}: EnquiryFormProps) {
  const initialBudget =
    defaultBudget && (budgetOptions as readonly string[]).includes(defaultBudget)
      ? defaultBudget
      : budgetOptions[0];

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    tripType: defaultTripType,
    destinationPreference: defaultDestination,
    departureCity: '',
    travelDateApprox: '',
    adultsCount: 2,
    childrenCount: 0,
    approxBudgetINR: initialBudget,
    additionalNotes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedEnquiryId, setSubmittedEnquiryId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Form validation
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    const cleanPhone = formData.phone.trim();
    if (!cleanPhone || cleanPhone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number for communication.');
      return;
    }
    if (!formData.destinationPreference.trim()) {
      setErrorMessage('Please specify your preferred travel destination or region.');
      return;
    }

    setIsSubmitting(true);

    try {
      const saved = await saveNewEnquiry({
        fullName: formData.fullName.trim(),
        phone: cleanPhone.startsWith('+') ? cleanPhone : `+91 ${cleanPhone}`,
        email: formData.email.trim() || undefined,
        tripType: formData.tripType,
        destinationPreference: formData.destinationPreference.trim(),
        departureCity: formData.departureCity.trim() || 'Not Specified',
        travelDateApprox: formData.travelDateApprox || 'Flexible',
        adultsCount: Number(formData.adultsCount),
        childrenCount: Number(formData.childrenCount),
        approxBudgetINR: formData.approxBudgetINR,
        additionalNotes: formData.additionalNotes.trim() || undefined,
        originPackageSlug,
        originPackageTitle,
      });

      setSubmittedEnquiryId(saved.id);
      setStatus('success');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error saving enquiry:', err);
      setErrorMessage('A temporary storage error occurred. Please try again or message our team directly on WhatsApp.');
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'success') {
    const waText = encodeURIComponent(
      `Hello! I just submitted custom trip enquiry #${submittedEnquiryId} for ${formData.destinationPreference} (${formData.adultsCount} adults, Budget: ${formData.approxBudgetINR}). Looking forward to discussing the itinerary.`
    );
    const instantWhatsAppUrl = `https://wa.me/${agencyConfig.contact.whatsappNumber}?text=${waText}`;

    return (
      <div className="p-8 text-center bg-white rounded-xl border border-emerald-200 shadow-sm">
        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-serif-luxury font-bold text-[#0F172A] mb-2">
          Enquiry Received Successfully!
        </h3>
        <p className="text-sm text-[#475569] max-w-md mx-auto mb-2 leading-relaxed">
          Thank you, <strong className="text-[#0F172A]">{formData.fullName}</strong>. Your enquiry reference is{' '}
          <code className="text-xs font-mono font-semibold bg-slate-100 px-2 py-0.5 rounded text-[#154D4F]">
            {submittedEnquiryId}
          </code>.
        </p>

        {/* Enquiry Details Confirmation Summary */}
        <div className="my-5 p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs text-[#475569] max-w-sm mx-auto text-left space-y-2">
          <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5">
            <span className="text-[#64748B]">Destination:</span>
            <strong className="text-[#0F172A]">{formData.destinationPreference}</strong>
          </div>
          <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5">
            <span className="text-[#64748B]">Travellers:</span>
            <strong className="text-[#0F172A]">
              {formData.adultsCount} Adults{formData.childrenCount > 0 ? `, ${formData.childrenCount} Children` : ''}
            </strong>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#64748B]">Enquiry Budget:</span>
            <strong className="text-[#154D4F] font-semibold">{formData.approxBudgetINR}</strong>
          </div>
        </div>

        <p className="text-xs text-[#64748B] max-w-sm mx-auto mb-6">
          Our destination specialist is reviewing your travel preferences for {formData.destinationPreference} and will share a customized day-wise proposal.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={instantWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Connect Faster on WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={() => {
              setFormData({
                fullName: '',
                phone: '',
                email: '',
                tripType: defaultTripType,
                destinationPreference: defaultDestination,
                departureCity: '',
                travelDateApprox: '',
                adultsCount: 2,
                childrenCount: 0,
                approxBudgetINR: initialBudget,
                additionalNotes: '',
              });
              setStatus('idle');
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-lg border border-[#E8E3DA] text-xs font-semibold text-[#0F172A] hover:bg-slate-50 transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white text-[#0F172A] p-6 sm:p-8 rounded-xl border border-[#E8E3DA] shadow-sm">
      {originPackageTitle && (
        <div className="p-3.5 rounded-lg bg-[#FAF8F5] border border-[#E8E3DA] flex items-center gap-2.5 text-xs text-[#154D4F]">
          <Sparkles className="w-4 h-4 text-[#C25E34] shrink-0" />
          <span>
            Enquiring specifically for: <strong>{originPackageTitle}</strong>
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Trip Type Selector */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-2">
          Trip Category
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, tripType: 'domestic' })}
            className={`py-2.5 px-4 text-xs font-semibold rounded-lg border text-center transition-all ${
              formData.tripType === 'domestic'
                ? 'bg-[#154D4F] text-white border-[#154D4F] shadow-sm'
                : 'bg-[#FAF8F5] text-[#475569] border-[#E8E3DA] hover:bg-white'
            }`}
          >
            Explore India (Domestic)
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, tripType: 'international' })}
            className={`py-2.5 px-4 text-xs font-semibold rounded-lg border text-center transition-all ${
              formData.tripType === 'international'
                ? 'bg-[#154D4F] text-white border-[#154D4F] shadow-sm'
                : 'bg-[#FAF8F5] text-[#475569] border-[#E8E3DA] hover:bg-white'
            }`}
          >
            Global (International)
          </button>
        </div>
      </div>

      {/* Row 1: Destination & Departure */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
            Destination / Region *
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3 top-3 text-[#94A3B8]" />
            <input
              type="text"
              required
              placeholder="e.g. Kashmir, Kerala, Bali, Switzerland"
              value={formData.destinationPreference}
              onChange={(e) => setFormData({ ...formData, destinationPreference: e.target.value })}
              style={{ color: '#0F172A', WebkitTextFillColor: '#0F172A' }}
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-[#E8E3DA] bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#C25E34]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
            Departure City
          </label>
          <input
            type="text"
            placeholder="e.g. Mumbai, Delhi, Bengaluru, Kolkata"
            value={formData.departureCity}
            onChange={(e) => setFormData({ ...formData, departureCity: e.target.value })}
            style={{ color: '#0F172A', WebkitTextFillColor: '#0F172A' }}
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-[#E8E3DA] bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#C25E34]"
          />
        </div>
      </div>

      {/* Row 2: Name & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
            Your Full Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Priya Sharma"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            style={{ color: '#0F172A', WebkitTextFillColor: '#0F172A' }}
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-[#E8E3DA] bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#C25E34]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
            Mobile Number (India +91) *
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 absolute left-3 top-3 text-[#94A3B8]" />
            <input
              type="tel"
              required
              placeholder="10-digit number e.g. 9876543210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={{ color: '#0F172A', WebkitTextFillColor: '#0F172A' }}
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-[#E8E3DA] bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#C25E34]"
            />
          </div>
        </div>
      </div>

      {/* Row 3: Email & Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
            Email Address <span className="text-[#94A3B8] font-normal">(Optional)</span>
          </label>
          <input
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{ color: '#0F172A', WebkitTextFillColor: '#0F172A' }}
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-[#E8E3DA] bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#C25E34]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
            Approximate Travel Dates
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-3 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="e.g. Next month, Diwali, June 2026"
              value={formData.travelDateApprox}
              onChange={(e) => setFormData({ ...formData, travelDateApprox: e.target.value })}
              style={{ color: '#0F172A', WebkitTextFillColor: '#0F172A' }}
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-[#E8E3DA] bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#C25E34]"
            />
          </div>
        </div>
      </div>

      {/* Row 4: Travellers & Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
            Adults (12+ yrs)
          </label>
          <input
            type="number"
            min={1}
            max={50}
            value={formData.adultsCount}
            onChange={(e) => setFormData({ ...formData, adultsCount: parseInt(e.target.value) || 1 })}
            style={{ color: '#0F172A', WebkitTextFillColor: '#0F172A' }}
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-[#E8E3DA] bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#C25E34]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
            Children (0-11 yrs)
          </label>
          <input
            type="number"
            min={0}
            max={20}
            value={formData.childrenCount}
            onChange={(e) => setFormData({ ...formData, childrenCount: parseInt(e.target.value) || 0 })}
            style={{ color: '#0F172A', WebkitTextFillColor: '#0F172A' }}
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-[#E8E3DA] bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#C25E34]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
            Approx. Budget (Total)
          </label>
          <select
            value={formData.approxBudgetINR}
            onChange={(e) => setFormData({ ...formData, approxBudgetINR: e.target.value })}
            style={{ color: '#0F172A', WebkitTextFillColor: '#0F172A' }}
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-[#E8E3DA] bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#C25E34]"
          >
            {budgetOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Additional Notes */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
          Special Requests / Hotel Category / Dietary Needs
        </label>
        <textarea
          rows={3}
          placeholder="e.g. Looking for a 4-star resort with valley view, Jain meal options, celebrating our 10th anniversary..."
          value={formData.additionalNotes}
          onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
          style={{ color: '#0F172A', WebkitTextFillColor: '#0F172A' }}
          className="w-full px-3 py-2.5 text-sm rounded-lg border border-[#E8E3DA] bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#C25E34]"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#C25E34] hover:bg-[#A74E28] disabled:bg-slate-400 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-md"
        >
          {isSubmitting ? (
            <span>Securing Your Request...</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Get Custom Itinerary & Free Quote</span>
            </>
          )}
        </button>
        <p className="text-[11px] text-center text-[#94A3B8] mt-2.5">
          🔒 Zero spam policy. We never share your contact number with unauthorized third parties.
        </p>
      </div>
    </form>
  );
}
