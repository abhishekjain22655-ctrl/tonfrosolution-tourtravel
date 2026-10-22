'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  Package as PackageIcon,
  Users,
  Settings,
  Plus,
  MessageCircle,
  Phone,
  CheckCircle,
  Clock,
  Search,
  Filter,
  LogOut,
  Edit,
  Trash2,
  Lock,
  ExternalLink,
  ShieldAlert,
  Database,
  ArrowRight,
} from 'lucide-react';
import { agencyConfig } from '@/config/agency';
import { CustomerEnquiry, TravelPackage } from '@/types/travel';
import { getStoredEnquiries, getStoredPackages, updateEnquiryStatus, saveStoredPackages } from '@/lib/storage';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'enquiries' | 'packages' | 'settings'>('enquiries');

  // Enquiries state
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>([]);
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<CustomerEnquiry | null>(null);
  const [internalNoteInput, setInternalNoteInput] = useState('');

  // Packages state
  const [packagesList, setPackagesList] = useState<TravelPackage[]>([]);
  const [packageSearch, setPackageSearch] = useState('');

  // Create Package Modal State
  const [showAddPackageModal, setShowAddPackageModal] = useState(false);
  const [newPkgData, setNewPkgData] = useState({
    title: '',
    tagline: '',
    destinationType: 'domestic' as 'domestic' | 'international',
    destinationName: '',
    regionOrCountry: '',
    durationDays: 5,
    durationNights: 4,
    startingPriceINR: 25000,
    categories: ['Family Vacation'] as TravelPackage['categories'],
    overview: '',
    bestTimeToVisit: 'October to March',
    hotelCategory: '4-Star Premium Resorts',
    heroImage: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80',
    route: '',
  });

  useEffect(() => {
    // Check if staff session is already active in sessionStorage
    const session = sessionStorage.getItem('vv_staff_session');
    if (session === 'active') {
      setIsAuthenticated(true);
      loadAdminData();
    }
  }, []);

  const loadAdminData = () => {
    setEnquiries(getStoredEnquiries());
    setPackagesList(getStoredPackages());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default staff demo passcode is 'travel2026' or 'admin123'
    if (passcode === 'travel2026' || passcode === 'admin123' || passcode === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('vv_staff_session', 'active');
      setAuthError('');
      loadAdminData();
    } else {
      setAuthError('Invalid staff access key. (Default demo key is: admin123 or travel2026)');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('vv_staff_session');
    setIsAuthenticated(false);
    setPasscode('');
  };

  const handleStatusChange = (id: string, newStatus: CustomerEnquiry['status']) => {
    const updated = updateEnquiryStatus(id, newStatus, internalNoteInput || undefined);
    setEnquiries(updated);
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry({
        ...selectedEnquiry,
        status: newStatus,
        internalNotes: internalNoteInput || selectedEnquiry.internalNotes,
      });
    }
  };

  const handleSaveInternalNote = (id: string) => {
    if (!selectedEnquiry) return;
    const updated = updateEnquiryStatus(id, selectedEnquiry.status, internalNoteInput);
    setEnquiries(updated);
    setSelectedEnquiry({ ...selectedEnquiry, internalNotes: internalNoteInput });
  };

  const handleTogglePackageStatus = (slug: string) => {
    const updated = packagesList.map((p) => {
      if (p.slug === slug) {
        return {
          ...p,
          status: (p.status === 'published' ? 'draft' : 'published') as 'published' | 'draft',
        };
      }
      return p;
    });
    setPackagesList(updated);
    saveStoredPackages(updated);
  };

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkgData.title.trim()) return;

    const slug = newPkgData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newPackage: TravelPackage = {
      id: slug,
      slug,
      title: newPkgData.title,
      tagline: newPkgData.tagline || 'Custom curated holiday package',
      destinationType: newPkgData.destinationType,
      destinationName: newPkgData.destinationName,
      regionOrCountry: newPkgData.regionOrCountry,
      durationDays: Number(newPkgData.durationDays),
      durationNights: Number(newPkgData.durationNights),
      startingPriceINR: Number(newPkgData.startingPriceINR),
      isPriceVerified: true,
      featured: false,
      categories: newPkgData.categories,
      heroImage: newPkgData.heroImage,
      galleryImages: [newPkgData.heroImage],
      overview: newPkgData.overview || 'Custom itinerary curated with handpicked boutique stays.',
      bestTimeToVisit: newPkgData.bestTimeToVisit,
      route: newPkgData.route || `${newPkgData.destinationName} Circuit`,
      hotelCategory: newPkgData.hotelCategory,
      itinerary: [
        {
          day: 1,
          title: `Arrival in ${newPkgData.destinationName}`,
          description: 'Meet and greet at airport/station with private chauffeur transfer to your confirmed hotel.',
          mealsIncluded: ['Dinner'],
          stay: newPkgData.hotelCategory,
        },
        {
          day: 2,
          title: 'Full Day Sightseeing & Local Experiences',
          description: 'Explore the key highlights, heritage landmarks, and scenic vantage points.',
          mealsIncluded: ['Breakfast', 'Dinner'],
          stay: newPkgData.hotelCategory,
        },
      ],
      inclusions: [
        `${newPkgData.durationNights} Nights accommodation in verified properties`,
        'Daily buffet breakfast and dinners',
        'Private dedicated AC vehicle throughout',
        'All state permits, driver allowances, and tolls',
      ],
      exclusions: ['Airfare / Train tickets', 'Personal expenses & GST'],
      cancellationPolicy: ['30+ days: 85% refund', '<15 days: non-refundable'],
      status: 'published',
    };

    const updated = [newPackage, ...packagesList];
    setPackagesList(updated);
    saveStoredPackages(updated);
    setShowAddPackageModal(false);
  };

  // Filtered enquiries
  const filteredEnquiries = enquiries.filter((enq) => {
    if (enquiryStatusFilter !== 'all' && enq.status !== enquiryStatusFilter) return false;
    if (enquirySearch.trim()) {
      const q = enquirySearch.toLowerCase();
      const matchName = enq.fullName.toLowerCase().includes(q);
      const matchPhone = enq.phone.includes(q);
      const matchDest = enq.destinationPreference.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchDest) return false;
    }
    return true;
  });

  // Filtered packages
  const filteredPackages = packagesList.filter((pkg) => {
    if (packageSearch.trim()) {
      const q = packageSearch.toLowerCase();
      return (
        pkg.title.toLowerCase().includes(q) ||
        pkg.destinationName.toLowerCase().includes(q) ||
        pkg.regionOrCountry.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#E8E3DA] p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#154D4F] text-white flex items-center justify-center mx-auto mb-2">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-serif-luxury font-bold text-[#0F172A]">
              Staff & Agency Portal
            </h1>
            <p className="text-xs text-[#64748B]">
              {agencyConfig.companyName} • Internal Management
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                {authError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                Staff Access Passcode
              </label>
              <input
                type="password"
                required
                placeholder="Enter access key (Demo: admin123)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-[#E8E3DA] focus:outline-none focus:ring-2 focus:ring-[#C25E34]"
              />
              <span className="text-[11px] text-[#94A3B8] block mt-1">
                Demo key: <strong className="text-[#154D4F]">admin123</strong>
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg bg-[#C25E34] hover:bg-[#A74E28] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm"
            >
              Sign In to Staff Console
            </button>
          </form>

          <div className="pt-4 border-t border-[#E8E3DA] text-center">
            <Link href="/" className="text-xs text-[#64748B] hover:text-[#0F172A]">
              ← Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F2EB]">
      {/* Top Admin Bar */}
      <header className="bg-[#0F1E20] text-white px-4 sm:px-8 py-3.5 border-b border-[#1B4D4F]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#C25E34] flex items-center justify-center text-white font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block">
                {agencyConfig.companyName} Console
              </span>
              <span className="text-[10px] text-[#C58B3E] font-medium tracking-wider uppercase">
                Staff & Lead Administration
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1 text-[#CBD5E1] hover:text-white transition-colors"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-[#CBD5E1] hover:text-white transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E8E3DA] pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('enquiries')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'enquiries'
                ? 'bg-[#154D4F] text-white shadow-sm'
                : 'text-[#475569] hover:bg-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customer Enquiries ({enquiries.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('packages')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'packages'
                ? 'bg-[#154D4F] text-white shadow-sm'
                : 'text-[#475569] hover:bg-white'
            }`}
          >
            <PackageIcon className="w-4 h-4" />
            <span>Manage Packages ({packagesList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'settings'
                ? 'bg-[#154D4F] text-white shadow-sm'
                : 'text-[#475569] hover:bg-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Company Data & Database</span>
          </button>
        </div>

        {/* ====================================================
            TAB 1: ENQUIRIES PIPELINE
        ==================================================== */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-[#E8E3DA] flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Search by name, phone, or destination..."
                  value={enquirySearch}
                  onChange={(e) => setEnquirySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#E8E3DA] bg-[#FAF8F5] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-[#64748B] font-medium">Status:</span>
                <select
                  value={enquiryStatusFilter}
                  onChange={(e) => setEnquiryStatusFilter(e.target.value)}
                  className="text-xs rounded-lg border border-[#E8E3DA] py-1.5 px-3 bg-[#FAF8F5] focus:outline-none"
                >
                  <option value="all">All Enquiries</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="quoted">Quoted</option>
                  <option value="converted">Converted</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Enquiries Grid / List */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Enquiries List (7 cols) */}
              <div className="lg:col-span-7 space-y-3">
                {filteredEnquiries.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-xl border border-[#E8E3DA] text-xs text-[#64748B]">
                    No customer enquiries found matching your filter.
                  </div>
                ) : (
                  filteredEnquiries.map((enq) => {
                    const isSelected = selectedEnquiry?.id === enq.id;
                    const statusColors = {
                      new: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                      contacted: 'bg-blue-50 text-blue-700 border-blue-200',
                      quoted: 'bg-purple-50 text-purple-700 border-purple-200',
                      converted: 'bg-amber-50 text-amber-700 border-amber-200',
                      archived: 'bg-slate-100 text-slate-600 border-slate-200',
                    };

                    return (
                      <div
                        key={enq.id}
                        onClick={() => {
                          setSelectedEnquiry(enq);
                          setInternalNoteInput(enq.internalNotes || '');
                        }}
                        className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${
                          isSelected
                            ? 'border-[#C25E34] ring-1 ring-[#C25E34] shadow-md'
                            : 'border-[#E8E3DA] hover:border-[#154D4F] shadow-2xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <span className="text-sm font-bold text-[#0F172A] block">
                              {enq.fullName}
                            </span>
                            <span className="text-xs text-[#64748B]">
                              {enq.phone} • Departure: {enq.departureCity}
                            </span>
                          </div>

                          <span
                            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${
                              statusColors[enq.status]
                            }`}
                          >
                            {enq.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#475569] mb-2">
                          <span className="font-semibold text-[#154D4F]">
                            📍 {enq.destinationPreference}
                          </span>
                          <span>•</span>
                          <span>
                            👥 {enq.adultsCount} Adults{enq.childrenCount > 0 ? `, ${enq.childrenCount} Kids` : ''}
                          </span>
                          <span>•</span>
                          <span>💰 {enq.approxBudgetINR}</span>
                        </div>

                        {enq.originPackageTitle && (
                          <div className="text-[11px] text-[#C25E34] bg-orange-50 px-2 py-1 rounded inline-block">
                            Origin Package: {enq.originPackageTitle}
                          </div>
                        )}

                        <div className="mt-2 pt-2 border-t border-[#F1ECE4] flex items-center justify-between text-[10px] text-[#94A3B8]">
                          <span>ID: {enq.id}</span>
                          <span>{new Date(enq.createdAt).toLocaleDateString('en-IN')}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Enquiry Detail Drawer (5 cols) */}
              <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-[#E8E3DA] shadow-sm sticky top-6 space-y-6">
                {selectedEnquiry ? (
                  <>
                    <div className="border-b border-[#E8E3DA] pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs uppercase font-bold tracking-wider text-[#94A3B8]">
                          Enquiry #{selectedEnquiry.id}
                        </span>
                        <span className="text-[10px] text-[#64748B]">
                          {new Date(selectedEnquiry.createdAt).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <h3 className="text-xl font-serif-luxury font-bold text-[#0F172A]">
                        {selectedEnquiry.fullName}
                      </h3>
                      <p className="text-xs text-[#64748B]">
                        {selectedEnquiry.email || 'No email provided'}
                      </p>
                    </div>

                    {/* Quick Action: WhatsApp Customer Directly */}
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-2">
                        Contact Traveler
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={`https://wa.me/${selectedEnquiry.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `Hello ${selectedEnquiry.fullName}! This is the ${agencyConfig.companyName} team regarding your enquiry for ${selectedEnquiry.destinationPreference}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>

                        <a
                          href={`tel:${selectedEnquiry.phone}`}
                          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-[#E8E3DA] hover:bg-slate-50 text-xs font-semibold text-[#0F172A]"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#C58B3E]" />
                          <span>Call Direct</span>
                        </a>
                      </div>
                    </div>

                    {/* Pipeline Status Buttons */}
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-2">
                        Update Status
                      </span>
                      <div className="grid grid-cols-3 gap-1.5 text-xs">
                        {(['new', 'contacted', 'quoted', 'converted', 'archived'] as const).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStatusChange(selectedEnquiry.id, st)}
                            className={`py-1.5 px-2 rounded-md font-medium capitalize text-[11px] border transition-all ${
                              selectedEnquiry.status === st
                                ? 'bg-[#154D4F] text-white border-[#154D4F]'
                                : 'bg-[#FAF8F5] text-[#475569] border-[#E8E3DA] hover:bg-white'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Traveler Details */}
                    <div className="p-3.5 rounded-lg bg-[#FAF8F5] border border-[#E8E3DA] text-xs space-y-2">
                      <p>
                        <strong>Destination:</strong> {selectedEnquiry.destinationPreference} (
                        {selectedEnquiry.tripType})
                      </p>
                      <p>
                        <strong>Departure City:</strong> {selectedEnquiry.departureCity}
                      </p>
                      <p>
                        <strong>Travel Date:</strong> {selectedEnquiry.travelDateApprox}
                      </p>
                      <p>
                        <strong>Travellers:</strong> {selectedEnquiry.adultsCount} Adults,{' '}
                        {selectedEnquiry.childrenCount} Kids
                      </p>
                      <p>
                        <strong>Budget:</strong> {selectedEnquiry.approxBudgetINR}
                      </p>
                      {selectedEnquiry.additionalNotes && (
                        <div className="pt-2 border-t border-[#E8E3DA]">
                          <strong className="block text-[#154D4F] mb-1">Customer Notes:</strong>
                          <p className="italic text-[#475569] leading-relaxed">
                            &ldquo;{selectedEnquiry.additionalNotes}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Internal Staff Notes */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569]">
                        Staff Follow-Up Log & Internal Notes
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Log quotes sent, date preferences discussed, or customer feedback..."
                        value={internalNoteInput}
                        onChange={(e) => setInternalNoteInput(e.target.value)}
                        className="w-full p-2.5 text-xs rounded-lg border border-[#E8E3DA] bg-white focus:outline-none focus:ring-1 focus:ring-[#C25E34]"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveInternalNote(selectedEnquiry.id)}
                        className="py-1.5 px-3 rounded-lg bg-[#154D4F] text-white text-[11px] font-semibold hover:bg-[#C25E34] transition-colors"
                      >
                        Save Internal Notes
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-16 text-xs text-[#94A3B8]">
                    Click any enquiry on the left to review details, update status, and launch WhatsApp chat.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            TAB 2: PACKAGES MANAGEMENT (CRUD)
        ==================================================== */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E8E3DA]">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Search packages by title or region..."
                  value={packageSearch}
                  onChange={(e) => setPackageSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#E8E3DA] bg-[#FAF8F5] focus:bg-white focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowAddPackageModal(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-[#C25E34] hover:bg-[#A74E28] text-white text-xs font-semibold uppercase tracking-wider transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Package</span>
              </button>
            </div>

            {/* Packages Table */}
            <div className="bg-white rounded-xl border border-[#E8E3DA] overflow-x-auto shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] border-b border-[#E8E3DA] text-[#475569] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Package Title</th>
                    <th className="p-4">Region</th>
                    <th className="p-4">Duration</th>
                    <th className="p-4">Price (INR)</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1ECE4]">
                  {filteredPackages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="p-4">
                        <span className="font-bold text-[#0F172A] block">{pkg.title}</span>
                        <span className="text-[11px] text-[#64748B]">{pkg.destinationName}</span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            pkg.destinationType === 'domestic'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {pkg.destinationType}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-[#334155]">
                        {pkg.durationDays}D / {pkg.durationNights}N
                      </td>
                      <td className="p-4 font-bold text-[#154D4F]">
                        ₹{pkg.startingPriceINR.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            pkg.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {pkg.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleTogglePackageStatus(pkg.slug)}
                          className="px-2.5 py-1 rounded border border-[#E8E3DA] text-[11px] font-medium hover:bg-white text-[#475569]"
                        >
                          {pkg.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <Link
                          href={`/packages/${pkg.slug}`}
                          target="_blank"
                          className="inline-block px-2.5 py-1 rounded bg-[#154D4F] text-white text-[11px] font-medium hover:bg-[#C25E34] transition-colors"
                        >
                          View Live
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ====================================================
            TAB 3: AGENCY SETTINGS & DATABASE GUIDE
        ==================================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-xl border border-[#E8E3DA] shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-[#E8E3DA]">
                <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] text-[#C25E34] flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-serif-luxury font-bold text-[#0F172A]">
                    Company Information & Backend Configuration
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Current configuration and seamless upgrade pathways
                  </p>
                </div>
              </div>

              {/* Company Info Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="space-y-3 p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA]">
                  <h4 className="font-bold text-[#154D4F] uppercase tracking-wider text-[11px]">
                    Current Agency Configuration
                  </h4>
                  <p><strong>Company Name:</strong> {agencyConfig.companyName}</p>
                  <p><strong>Tagline:</strong> {agencyConfig.tagline}</p>
                  <p><strong>Primary Phone:</strong> {agencyConfig.contact.displayPhone}</p>
                  <p><strong>WhatsApp:</strong> {agencyConfig.contact.whatsappDisplay}</p>
                  <p><strong>Official Email:</strong> {agencyConfig.contact.email}</p>
                  <p><strong>Head Office:</strong> {agencyConfig.contact.officeAddress.city}, {agencyConfig.contact.officeAddress.country}</p>
                </div>

                <div className="space-y-3 p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA]">
                  <h4 className="font-bold text-[#C25E34] uppercase tracking-wider text-[11px]">
                    How to Update Company Information Later
                  </h4>
                  <p className="text-[#475569] leading-relaxed">
                    Whenever you are ready to upload your official company details, GSTIN, and registration certificates:
                  </p>
                  <ol className="list-decimal pl-4 space-y-1.5 text-[#334155]">
                    <li>Open <code className="font-mono bg-white px-1 py-0.5 rounded text-[#154D4F]">src/config/agency.ts</code>.</li>
                    <li>Update your company name, phones, WhatsApp, address, and email.</li>
                    <li>Save the file. Every page, footer, header, and WhatsApp link will immediately update!</li>
                  </ol>
                </div>
              </div>

              {/* Supabase backend status */}
              <div className="p-5 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-900">
                  <ShieldAlert className="w-4 h-4 text-blue-700" />
                  <span>Supabase Backend Integration Status</span>
                </div>
                <p className="leading-relaxed">
                  Currently running in <strong>Local Storage & Memory Mode</strong>. All newly created packages and enquiries are stored safely in local persistence. A full PostgreSQL schema is prepared in <code className="font-mono bg-white px-1.5 py-0.5 rounded text-[#154D4F]">supabase-schema.sql</code> with Row Level Security (RLS) whenever you choose to connect a live Supabase project.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Create Package */}
      {showAddPackageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E3DA]">
              <h3 className="text-xl font-serif-luxury font-bold text-[#0F172A]">
                Create New Holiday Package
              </h3>
              <button
                type="button"
                onClick={() => setShowAddPackageModal(false)}
                className="text-[#64748B] hover:text-[#0F172A]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePackage} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase text-[#475569] mb-1">
                  Package Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kashmir: Gulmarg & Pahalgam Blossom Tour"
                  value={newPkgData.title}
                  onChange={(e) => setNewPkgData({ ...newPkgData, title: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#E8E3DA]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase text-[#475569] mb-1">
                    Region Type *
                  </label>
                  <select
                    value={newPkgData.destinationType}
                    onChange={(e) =>
                      setNewPkgData({
                        ...newPkgData,
                        destinationType: e.target.value as 'domestic' | 'international',
                      })
                    }
                    className="w-full p-2.5 rounded-lg border border-[#E8E3DA]"
                  >
                    <option value="domestic">Domestic (India)</option>
                    <option value="international">International</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase text-[#475569] mb-1">
                    Destination Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kashmir, Kerala, Bali"
                    value={newPkgData.destinationName}
                    onChange={(e) => setNewPkgData({ ...newPkgData, destinationName: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E8E3DA]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold uppercase text-[#475569] mb-1">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newPkgData.durationDays}
                    onChange={(e) => setNewPkgData({ ...newPkgData, durationDays: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg border border-[#E8E3DA]"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase text-[#475569] mb-1">
                    Duration (Nights)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newPkgData.durationNights}
                    onChange={(e) => setNewPkgData({ ...newPkgData, durationNights: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg border border-[#E8E3DA]"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase text-[#475569] mb-1">
                    Starting Price (INR)
                  </label>
                  <input
                    type="number"
                    min={5000}
                    step={500}
                    value={newPkgData.startingPriceINR}
                    onChange={(e) => setNewPkgData({ ...newPkgData, startingPriceINR: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg border border-[#E8E3DA]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#475569] mb-1">
                  Tagline / Catchphrase
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gondola rides, luxury Dal lake shikara, and pine valleys"
                  value={newPkgData.tagline}
                  onChange={(e) => setNewPkgData({ ...newPkgData, tagline: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#E8E3DA]"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#475569] mb-1">
                  Overview Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the holiday experience..."
                  value={newPkgData.overview}
                  onChange={(e) => setNewPkgData({ ...newPkgData, overview: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#E8E3DA]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddPackageModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#E8E3DA] text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#C25E34] hover:bg-[#A74E28] text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Publish Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
