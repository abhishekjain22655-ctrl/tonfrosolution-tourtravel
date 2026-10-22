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
  Search,
  LogOut,
  Edit3,
  Trash2,
  Lock,
  ExternalLink,
  ShieldAlert,
  Database,
  Key,
  Eye,
  Check,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  RefreshCw,
  CheckCircle2,
  Server,
  Star,
} from 'lucide-react';
import { agencyConfig } from '@/config/agency';
import { CustomerEnquiry, TravelPackage, ItineraryDay } from '@/types/travel';
import {
  getStoredEnquiries,
  getStoredPackages,
  updateEnquiryStatus,
  saveStoredPackages,
  saveOrUpdatePackage,
  deletePackage,
  getAdminPasscode,
  saveAdminPasscode,
  fetchMongoDBStatus,
  fetchPackagesFromMongoDB,
  fetchEnquiriesFromMongoDB,
  seedMongoDB,
} from '@/lib/storage';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const interval = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) {
          localStorage.removeItem('vv_admin_lockout_until');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutRemaining]);

  // MongoDB Status State
  const [dbStatus, setDbStatus] = useState<{
    configured: boolean;
    connected: boolean;
    stats?: { packages: number; enquiries: number; destinations: number };
    message?: string;
  }>({ configured: false, connected: false });
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
  const [packageSuccessMsg, setPackageSuccessMsg] = useState('');

  // Add / Edit Package Modal State
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [packageFormData, setPackageFormData] = useState<Partial<TravelPackage>>({
    id: '',
    slug: '',
    title: '',
    tagline: '',
    destinationType: 'domestic',
    destinationName: '',
    regionOrCountry: '',
    durationDays: 5,
    durationNights: 4,
    startingPriceINR: 25000,
    categories: ['Family Vacation'],
    overview: '',
    bestTimeToVisit: 'October to March',
    hotelCategory: '4-Star Premium Resorts',
    heroImage: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80',
    route: '',
    badge: 'Trending',
    status: 'published',
  });

  // Password Management State
  const [currentPasscode, setCurrentPasscode] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const session = sessionStorage.getItem('vv_staff_session');
    if (session === 'active') {
      setIsAuthenticated(true);
      loadAdminData();
    }
    try {
      const lockUntil = localStorage.getItem('vv_admin_lockout_until');
      if (lockUntil) {
        const remaining = Math.max(0, Math.ceil((parseInt(lockUntil, 10) - Date.now()) / 1000));
        if (remaining > 0) {
          setLockoutRemaining(remaining);
        } else {
          localStorage.removeItem('vv_admin_lockout_until');
        }
      }
    } catch {}
  }, []);

  const loadAdminData = async () => {
    // 1. Immediately populate from local cache (0ms latency)
    setEnquiries(getStoredEnquiries());
    setPackagesList(getStoredPackages());

    // 2. Fetch live status & records from MongoDB API
    try {
      const status = await fetchMongoDBStatus();
      setDbStatus(status);

      if (status.connected) {
        const [remotePackages, remoteEnquiries] = await Promise.all([
          fetchPackagesFromMongoDB(),
          fetchEnquiriesFromMongoDB(),
        ]);
        if (remotePackages && remotePackages.length > 0) {
          setPackagesList(remotePackages);
        }
        if (remoteEnquiries && remoteEnquiries.length > 0) {
          setEnquiries(remoteEnquiries);
        }
      }
    } catch (err) {
      console.warn('MongoDB connection sync check:', err);
    }
  };

  const handleRefreshDB = async () => {
    setIsRefreshing(true);
    await loadAdminData();
    setIsRefreshing(false);
  };

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    setSeedMsg(null);
    try {
      const result = await seedMongoDB();
      if (result.success) {
        setSeedMsg({ type: 'success', text: result.message });
        await loadAdminData();
      } else {
        setSeedMsg({ type: 'error', text: result.message });
      }
    } catch (err: any) {
      setSeedMsg({ type: 'error', text: err?.message || 'Failed to seed MongoDB' });
    } finally {
      setIsSeeding(false);
      setTimeout(() => setSeedMsg(null), 6000);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (lockoutRemaining > 0) {
      setAuthError(`Console locked. Please wait ${Math.ceil(lockoutRemaining / 60)} minute(s) before trying again.`);
      return;
    }

    const activeKey = getAdminPasscode();
    // Allow active passcode or backup keys 'travel2026', 'admin123'
    if (passcode.trim() === activeKey || passcode === 'travel2026' || passcode === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('vv_staff_session', 'active');
      setAuthError('');
      setFailedAttempts(0);
      try {
        localStorage.removeItem('vv_admin_lockout_until');
      } catch {}
      loadAdminData();
    } else {
      const nextCount = failedAttempts + 1;
      setFailedAttempts(nextCount);
      if (nextCount >= 5) {
        const lockUntil = Date.now() + 15 * 60 * 1000;
        try {
          localStorage.setItem('vv_admin_lockout_until', lockUntil.toString());
        } catch {}
        setLockoutRemaining(15 * 60);
        setAuthError('Too many failed attempts. Staff portal locked for 15 minutes.');
      } else {
        setAuthError(`Invalid staff access passcode. (${5 - nextCount} attempt(s) remaining)`);
      }
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

  // Toggle publish / unpublish
  const handleTogglePackageStatus = (pkg: TravelPackage) => {
    const newStatus = pkg.status === 'published' ? 'draft' : 'published';
    const updatedPkg = { ...pkg, status: newStatus as 'published' | 'draft' };
    saveOrUpdatePackage(updatedPkg);
    const refreshed = getStoredPackages();
    setPackagesList(refreshed);
    setPackageSuccessMsg(`Package "${pkg.title}" is now ${newStatus.toUpperCase()}!`);
    setTimeout(() => setPackageSuccessMsg(''), 4000);
  };

  // Open Edit Package Modal
  const handleOpenEdit = (pkg: TravelPackage) => {
    setIsEditing(true);
    setPackageFormData({
      ...pkg,
      itinerary: pkg.itinerary?.length
        ? pkg.itinerary.map((d, i) => ({ ...d, day: d.day || i + 1 }))
        : [
            {
              day: 1,
              title: `Arrival in ${pkg.destinationName}`,
              description: 'Chauffeur meet and greet at airport/station with private check-in to confirmed accommodation.',
              mealsIncluded: ['Dinner'],
              stay: pkg.hotelCategory || '4-Star Stay',
            },
          ],
    });
    setShowPackageModal(true);
  };

  // Open Add Package Modal
  const handleOpenAdd = () => {
    setIsEditing(false);
    setPackageFormData({
      id: '',
      slug: '',
      title: '',
      tagline: '',
      destinationType: 'domestic',
      destinationName: '',
      regionOrCountry: '',
      durationDays: 4,
      durationNights: 3,
      startingPriceINR: 25000,
      categories: ['Family Vacation'],
      overview: '',
      bestTimeToVisit: 'October to March',
      hotelCategory: '4-Star Handpicked Stays',
      heroImage: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80',
      route: '',
      badge: 'Bestseller',
      status: 'published',
      itinerary: [
        {
          day: 1,
          title: 'Arrival & Scenic Welcome',
          description: 'Airport/station meet and greet with chauffeur transfer to confirmed luxury accommodation. Leisure evening at own pace.',
          mealsIncluded: ['Dinner'],
          stay: '4-Star Luxury Resort',
        },
        {
          day: 2,
          title: 'Full Day Sightseeing & Local Experiences',
          description: 'Comprehensive guided exploration of key highlights, viewpoints, and cultural landmarks in dedicated private vehicle.',
          mealsIncluded: ['Breakfast', 'Dinner'],
          stay: '4-Star Luxury Resort',
        },
        {
          day: 3,
          title: 'Signature Experiences & Leisure',
          description: 'Explore scenic nature trails, local markets, and optional adventure activities before relaxing evening dinner.',
          mealsIncluded: ['Breakfast', 'Dinner'],
          stay: '4-Star Luxury Resort',
        },
        {
          day: 4,
          title: 'Farewell & Departure Transfer',
          description: 'Relaxed breakfast, room check-out, and on-time private transfer back to airport/station with cherished holiday memories.',
          mealsIncluded: ['Breakfast'],
          stay: 'Return Journey',
        },
      ],
    });
    setShowPackageModal(true);
  };

  // Day-by-Day Itinerary Management
  const handleAddItineraryDay = () => {
    const current = packageFormData.itinerary || [];
    const nextDayNum = current.length + 1;
    const newDay: ItineraryDay = {
      day: nextDayNum,
      title: `Day ${nextDayNum}: Sightseeing & Exploration`,
      description: 'Explore local attractions and scenic landmarks in dedicated private vehicle.',
      mealsIncluded: ['Breakfast', 'Dinner'],
      stay: packageFormData.hotelCategory || '4-Star Resort',
    };
    setPackageFormData({
      ...packageFormData,
      itinerary: [...current, newDay],
      durationDays: Math.max(packageFormData.durationDays || 1, nextDayNum),
      durationNights: Math.max(packageFormData.durationNights || 1, nextDayNum - 1),
    });
  };

  const handleUpdateItineraryDay = (index: number, field: keyof ItineraryDay, value: any) => {
    const current = [...(packageFormData.itinerary || [])];
    if (!current[index]) return;
    current[index] = { ...current[index], [field]: value };
    setPackageFormData({ ...packageFormData, itinerary: current });
  };

  const handleRemoveItineraryDay = (index: number) => {
    const current = [...(packageFormData.itinerary || [])];
    if (current.length <= 1) {
      alert('A package must have at least one day in the itinerary.');
      return;
    }
    current.splice(index, 1);
    const reindexed = current.map((d, i) => ({ ...d, day: i + 1 }));
    setPackageFormData({
      ...packageFormData,
      itinerary: reindexed,
      durationDays: reindexed.length,
      durationNights: Math.max(1, reindexed.length - 1),
    });
  };

  // Handle multiple direct file uploads from phone or computer
  const [uploadError, setUploadError] = useState('');
  const [customImageUrlInput, setCustomImageUrlInput] = useState('');

  const handleMultipleFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError('');
    const fileList = Array.from(files);
    const loadedImages: string[] = [];
    let completedCount = 0;

    fileList.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Some images exceeded 5MB and were skipped.');
        completedCount++;
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          loadedImages.push(dataUrl);
        }
        completedCount++;

        if (completedCount === fileList.length && loadedImages.length > 0) {
          setPackageFormData((prev) => {
            const currentGallery = prev.galleryImages?.length
              ? [...prev.galleryImages]
              : prev.heroImage
              ? [prev.heroImage]
              : [];
            const merged = [...currentGallery, ...loadedImages];
            return {
              ...prev,
              heroImage: prev.heroImage || merged[0] || '',
              galleryImages: merged,
            };
          });
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input value so same files can be selected again
    e.target.value = '';
  };

  const handleAddCustomImageUrl = () => {
    const url = customImageUrlInput.trim();
    if (!url) return;

    setPackageFormData((prev) => {
      const currentGallery = prev.galleryImages?.length
        ? [...prev.galleryImages]
        : prev.heroImage
        ? [prev.heroImage]
        : [];
      const merged = [...currentGallery, url];
      return {
        ...prev,
        heroImage: prev.heroImage || url,
        galleryImages: merged,
      };
    });
    setCustomImageUrlInput('');
  };

  const handleSetCoverPhoto = (imgUrl: string) => {
    setPackageFormData((prev) => ({
      ...prev,
      heroImage: imgUrl,
    }));
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setPackageFormData((prev) => {
      const currentGallery = [...(prev.galleryImages || [])];
      const removedUrl = currentGallery[indexToRemove];
      currentGallery.splice(indexToRemove, 1);

      let nextHero = prev.heroImage;
      if (prev.heroImage === removedUrl) {
        nextHero = currentGallery[0] || '';
      }

      return {
        ...prev,
        heroImage: nextHero,
        galleryImages: currentGallery,
      };
    });
  };

  // Save Package (Create or Edit)
  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageFormData.title?.trim()) return;

    const slug =
      packageFormData.slug?.trim() ||
      packageFormData
        .title!.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const pkgToSave: TravelPackage = {
      id: packageFormData.id || slug,
      slug,
      title: packageFormData.title!,
      tagline: packageFormData.tagline || 'Curated holiday package experience',
      destinationType: packageFormData.destinationType || 'domestic',
      destinationName: packageFormData.destinationName || 'Destination',
      regionOrCountry: packageFormData.regionOrCountry || 'India',
      durationDays: Number(packageFormData.durationDays) || 5,
      durationNights: Number(packageFormData.durationNights) || 4,
      startingPriceINR: Number(packageFormData.startingPriceINR) || 25000,
      originalPriceINR: packageFormData.originalPriceINR,
      isPriceVerified: true,
      featured: packageFormData.featured ?? false,
      badge: packageFormData.badge || undefined,
      categories: (packageFormData.categories as TravelPackage['categories']) || ['Family Vacation'],
      heroImage:
        packageFormData.heroImage ||
        'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80',
      galleryImages: packageFormData.galleryImages?.length
        ? packageFormData.galleryImages
        : [packageFormData.heroImage || 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80'],
      overview: packageFormData.overview || 'Experience handcrafted stays and seamless private sightseeing.',
      bestTimeToVisit: packageFormData.bestTimeToVisit || 'October to March',
      route: packageFormData.route || `${packageFormData.destinationName} Circuit`,
      hotelCategory: packageFormData.hotelCategory || '4-Star Verified Resorts',
      itinerary: packageFormData.itinerary?.length
        ? packageFormData.itinerary
        : [
            {
              day: 1,
              title: `Arrival in ${packageFormData.destinationName}`,
              description: 'Chauffeur meet and greet at airport/station with private check-in to confirmed accommodation.',
              mealsIncluded: ['Dinner'],
              stay: packageFormData.hotelCategory,
            },
            {
              day: 2,
              title: 'Full Day Sightseeing & Local Explorations',
              description: 'Explore scenic landmarks, cultural highlights, and local markets at your own unhurried pace.',
              mealsIncluded: ['Breakfast', 'Dinner'],
              stay: packageFormData.hotelCategory,
            },
          ],
      inclusions: packageFormData.inclusions?.length
        ? packageFormData.inclusions
        : [
            `${packageFormData.durationNights || 4} Nights accommodation in verified properties`,
            'Daily buffet breakfast and curated dinners',
            'Private dedicated air-conditioned vehicle throughout',
            'All interstate permits, driver allowances, tolls, and parking',
          ],
      exclusions: packageFormData.exclusions?.length
        ? packageFormData.exclusions
        : ['Flights / Train tickets', 'Personal expenses, laundry, and tips', '5% GST'],
      cancellationPolicy: packageFormData.cancellationPolicy?.length
        ? packageFormData.cancellationPolicy
        : ['30+ days prior to departure: 85% refund', '<15 days: non-refundable'],
      status: (packageFormData.status as 'published' | 'draft') || 'published',
    };

    saveOrUpdatePackage(pkgToSave);
    const refreshed = getStoredPackages();
    setPackagesList(refreshed);
    setShowPackageModal(false);
    setPackageSuccessMsg(
      isEditing
        ? `Package "${pkgToSave.title}" updated successfully and reflected on website!`
        : `New trip "${pkgToSave.title}" published successfully!`
    );
    setTimeout(() => setPackageSuccessMsg(''), 4500);
  };

  // Delete Package
  const handleDeletePackage = (slug: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the trip "${title}"? This will remove it from the website.`)) {
      deletePackage(slug);
      setPackagesList(getStoredPackages());
      setPackageSuccessMsg(`Package "${title}" deleted.`);
      setTimeout(() => setPackageSuccessMsg(''), 4000);
    }
  };

  // Change Password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    const activeKey = getAdminPasscode();

    if (currentPasscode !== activeKey) {
      setPasswordMsg({ type: 'error', text: 'Current passcode is incorrect.' });
      return;
    }
    if (newPasscode.length < 4) {
      setPasswordMsg({ type: 'error', text: 'New passcode must be at least 4 characters.' });
      return;
    }
    if (newPasscode !== confirmPasscode) {
      setPasswordMsg({ type: 'error', text: 'New passcodes do not match.' });
      return;
    }

    const saved = saveAdminPasscode(newPasscode);
    if (saved) {
      setPasswordMsg({ type: 'success', text: 'Admin passcode updated successfully! Use your new passcode for next login.' });
      setCurrentPasscode('');
      setNewPasscode('');
      setConfirmPasscode('');
    } else {
      setPasswordMsg({ type: 'error', text: 'Failed to update passcode in storage.' });
    }
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

  // Login screen
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
                disabled={lockoutRemaining > 0}
                placeholder={lockoutRemaining > 0 ? "Console temporarily locked" : "Enter access passcode"}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-[#E8E3DA] focus:outline-none focus:ring-2 focus:ring-[#C25E34] disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={lockoutRemaining > 0}
              className="w-full py-3 px-4 rounded-lg bg-[#C25E34] hover:bg-[#A74E28] disabled:bg-slate-400 disabled:cursor-not-allowed text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm active:scale-95"
            >
              {lockoutRemaining > 0
                ? `Locked (${Math.ceil(lockoutRemaining / 60)} min)`
                : 'Sign In to Staff Console'}
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

          <div className="flex items-center gap-3 sm:gap-4 text-xs">
            {/* Database Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium border bg-white/5 border-white/10">
              <span
                className={`w-2 h-2 rounded-full ${
                  dbStatus.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="text-[#CBD5E1]">
                {dbStatus.connected ? (
                  <span className="flex items-center gap-1.5">
                    <span className="text-emerald-300 font-semibold">MongoDB Atlas</span>
                    <span className="text-[#94A3B8]">
                      ({dbStatus.stats?.packages ?? packagesList.length} trips)
                    </span>
                  </span>
                ) : (
                  <span className="text-amber-300">Local Mode (DB offline)</span>
                )}
              </span>
              <button
                type="button"
                onClick={handleRefreshDB}
                title="Sync with database"
                disabled={isRefreshing}
                className="text-[#94A3B8] hover:text-white transition-colors ml-0.5"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-[#CBD5E1] hover:text-white transition-colors"
            >
              <span>View Website</span>
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
        {packageSuccessMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 shadow-xs">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{packageSuccessMsg}</span>
          </div>
        )}

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
            <span>Manage Trips & Packages ({packagesList.length})</span>
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
            <span>Security & Passcode</span>
          </button>
        </div>

        {/* ====================================================
            TAB 1: ENQUIRIES PIPELINE
        ==================================================== */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
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
            TAB 2: PACKAGES MANAGEMENT (CRUD + LIVE REFLECTION)
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
                onClick={handleOpenAdd}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg bg-[#C25E34] hover:bg-[#A74E28] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Trip</span>
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
                    <th className="p-4">Starting Price</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1ECE4]">
                  {filteredPackages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={pkg.heroImage}
                            alt={pkg.title}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-[#0F172A] block">{pkg.title}</span>
                            <span className="text-[11px] text-[#64748B]">{pkg.destinationName}</span>
                          </div>
                        </div>
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
                        <button
                          type="button"
                          onClick={() => handleTogglePackageStatus(pkg)}
                          title="Click to toggle publish status"
                          className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all border ${
                            pkg.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                              : 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200'
                          }`}
                        >
                          {pkg.status === 'published' ? '● Published' : '○ Draft (Hidden)'}
                        </button>
                      </td>
                      <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(pkg)}
                          className="p-1.5 rounded-lg border border-[#E8E3DA] text-[#154D4F] hover:bg-[#154D4F] hover:text-white transition-colors"
                          title="Edit package details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeletePackage(pkg.slug, pkg.title)}
                          className="p-1.5 rounded-lg border border-[#E8E3DA] text-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
                          title="Delete trip"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <Link
                          href={`/packages/${pkg.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E8E3DA] text-[#0F172A] hover:bg-[#C25E34] hover:text-white text-[11px] font-semibold transition-colors"
                        >
                          <span>Live</span>
                          <ExternalLink className="w-3 h-3" />
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
            TAB 3: SECURITY, PASSCODE & COMPANY CONFIG
        ==================================================== */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Change Passcode Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E3DA] shadow-sm space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-[#E8E3DA]">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#C25E34] flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F172A] font-serif-luxury">
                    Change Staff Admin Passcode
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Update your internal console access password
                  </p>
                </div>
              </div>

              {passwordMsg && (
                <div
                  className={`p-3 rounded-lg text-xs flex items-center gap-2 border ${
                    passwordMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {passwordMsg.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{passwordMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold uppercase text-[#475569] mb-1">
                    Current Passcode
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter current passcode"
                    value={currentPasscode}
                    onChange={(e) => setCurrentPasscode(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E8E3DA] bg-white focus:outline-none focus:ring-1 focus:ring-[#C25E34]"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase text-[#475569] mb-1">
                    New Passcode
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter at least 4 characters"
                    value={newPasscode}
                    onChange={(e) => setNewPasscode(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E8E3DA] bg-white focus:outline-none focus:ring-1 focus:ring-[#C25E34]"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase text-[#475569] mb-1">
                    Confirm New Passcode
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Re-enter new passcode"
                    value={confirmPasscode}
                    onChange={(e) => setConfirmPasscode(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E8E3DA] bg-white focus:outline-none focus:ring-1 focus:ring-[#C25E34]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-[#154D4F] hover:bg-[#C25E34] text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  Update Passcode
                </button>
              </form>
            </div>

            {/* Company Data Guidance */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E3DA] shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-[#E8E3DA]">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F172A] font-serif-luxury">
                    Company Configuration Notice
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Current active details & future real data upload
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA] text-xs space-y-2">
                <p><strong>Company:</strong> {agencyConfig.companyName}</p>
                <p><strong>Support Phone:</strong> {agencyConfig.contact.displayPhone}</p>
                <p><strong>WhatsApp:</strong> {agencyConfig.contact.whatsappDisplay}</p>
                <p><strong>Email:</strong> {agencyConfig.contact.email}</p>
                <p><strong>Location:</strong> {agencyConfig.contact.officeAddress.city}, {agencyConfig.contact.officeAddress.country}</p>
              </div>

              <p className="text-xs text-[#64748B] leading-relaxed">
                When you are ready to upload your official company registration, GSTIN, phone, and WhatsApp numbers, simply update <code>src/config/agency.ts</code>. The entire website, footers, headers, and WhatsApp links will update automatically!
              </p>
            </div>

            {/* MongoDB Atlas Cloud Database Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E3DA] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E3DA]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A] font-serif-luxury">
                      MongoDB Atlas Cloud Database
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Free tier database (M0 512MB) integration & live synchronizer
                    </p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                    dbStatus.connected
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      dbStatus.connected ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'
                    }`}
                  />
                  <span>{dbStatus.connected ? 'Cluster Active' : 'Offline / Local'}</span>
                </span>
              </div>

              {seedMsg && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    seedMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {seedMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{seedMsg.text}</span>
                </div>
              )}

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E3DA] text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#E8E3DA]/60 pb-2">
                  <span className="text-[#64748B]">Connection String</span>
                  <span className="font-mono font-semibold text-[#0F172A]">
                    {dbStatus.configured ? 'Configured in .env.local' : 'Not configured yet'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="bg-white p-2.5 rounded-lg border border-[#E8E3DA]">
                    <span className="block text-lg font-bold text-[#154D4F]">
                      {dbStatus.stats?.packages ?? packagesList.length}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-[#64748B]">Packages</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-[#E8E3DA]">
                    <span className="block text-lg font-bold text-[#C25E34]">
                      {dbStatus.stats?.enquiries ?? enquiries.length}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-[#64748B]">Enquiries</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-[#E8E3DA]">
                    <span className="block text-lg font-bold text-[#0F172A]">
                      {dbStatus.stats?.destinations ?? 10}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-[#64748B]">Destinations</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleSeedDatabase}
                  disabled={isSeeding}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#154D4F] hover:bg-[#103D3F] text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
                  <span>
                    {isSeeding
                      ? 'Seeding default records...'
                      : 'Seed / Re-sync Default Packages to MongoDB'}
                  </span>
                </button>

                <p className="text-[11px] text-[#64748B] leading-relaxed">
                  To connect your free MongoDB Atlas database, open <code>.env.local</code> in the project root and paste your free M0 connection string into <code>MONGODB_URI</code>. See <code>MONGODB_SETUP_GUIDE.md</code> for exact steps.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Create or Edit Package */}
      {showPackageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E3DA]">
              <h3 className="text-xl font-serif-luxury font-bold text-[#0F172A]">
                {isEditing ? 'Edit Holiday Package' : 'Add New Trip to Website'}
              </h3>
              <button
                type="button"
                onClick={() => setShowPackageModal(false)}
                className="text-[#64748B] hover:text-[#0F172A] p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase text-[#475569] mb-1">
                  Trip / Package Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kashmir: Gulmarg & Dal Lake Blossom Tour"
                  value={packageFormData.title || ''}
                  onChange={(e) => setPackageFormData({ ...packageFormData, title: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#E8E3DA] focus:ring-1 focus:ring-[#C25E34] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase text-[#475569] mb-1">
                    Region Category *
                  </label>
                  <select
                    value={packageFormData.destinationType || 'domestic'}
                    onChange={(e) =>
                      setPackageFormData({
                        ...packageFormData,
                        destinationType: e.target.value as 'domestic' | 'international',
                      })
                    }
                    className="w-full p-2.5 rounded-lg border border-[#E8E3DA] bg-white focus:ring-1 focus:ring-[#C25E34] outline-none"
                  >
                    <option value="domestic">Domestic (Incredible India)</option>
                    <option value="international">Global (International)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase text-[#475569] mb-1">
                    Destination Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kashmir, Kerala, Bali, Switzerland"
                    value={packageFormData.destinationName || ''}
                    onChange={(e) => setPackageFormData({ ...packageFormData, destinationName: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E8E3DA] focus:ring-1 focus:ring-[#C25E34] outline-none"
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
                    value={packageFormData.durationDays || 5}
                    onChange={(e) => setPackageFormData({ ...packageFormData, durationDays: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg border border-[#E8E3DA] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase text-[#475569] mb-1">
                    Duration (Nights)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={packageFormData.durationNights || 4}
                    onChange={(e) => setPackageFormData({ ...packageFormData, durationNights: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg border border-[#E8E3DA] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase text-[#475569] mb-1">
                    Starting Price (₹ INR)
                  </label>
                  <input
                    type="number"
                    min={1000}
                    step={500}
                    value={packageFormData.startingPriceINR || 25000}
                    onChange={(e) =>
                      setPackageFormData({ ...packageFormData, startingPriceINR: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-lg border border-[#E8E3DA] outline-none font-bold text-[#154D4F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase text-[#475569] mb-1">
                    Publish Status
                  </label>
                  <select
                    value={packageFormData.status || 'published'}
                    onChange={(e) =>
                      setPackageFormData({
                        ...packageFormData,
                        status: e.target.value as 'published' | 'draft',
                      })
                    }
                    className="w-full p-2.5 rounded-lg border border-[#E8E3DA] bg-white outline-none font-semibold"
                  >
                    <option value="published">Published (Visible to Visitors)</option>
                    <option value="draft">Draft (Hidden from Visitors)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase text-[#475569] mb-1">
                    Card Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bestseller, Luxury, Trending"
                    value={packageFormData.badge || ''}
                    onChange={(e) => setPackageFormData({ ...packageFormData, badge: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E8E3DA] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#475569] mb-1">
                  Tagline / Highlights
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gondola Phase 2, Dal Lake Houseboat stay, and pine valley walks"
                  value={packageFormData.tagline || ''}
                  onChange={(e) => setPackageFormData({ ...packageFormData, tagline: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#E8E3DA] outline-none"
                />
              </div>

              {/* Multi-Photo Gallery Upload & Manager */}
              <div className="space-y-3 p-4 rounded-xl border border-[#E8E3DA] bg-[#FAF8F5]/60">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-bold uppercase text-[11px] text-[#154D4F]">
                      Trip Photos & Gallery
                    </label>
                    <p className="text-[11px] text-[#64748B]">
                      Upload multiple photos from your device or paste web links. Choose which photo is the main Cover Photo.
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#154D4F]/10 text-[#154D4F] text-[11px] font-bold">
                    {(packageFormData.galleryImages?.length || (packageFormData.heroImage ? 1 : 0))} Photos
                  </span>
                </div>

                {uploadError && (
                  <p className="text-[11px] text-rose-600 font-semibold">{uploadError}</p>
                )}

                {/* Upload & Add Link Controls */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#154D4F] hover:bg-[#C25E34] text-white text-xs font-semibold cursor-pointer transition-colors shadow-2xs shrink-0">
                    <Upload className="w-4 h-4" />
                    <span>Upload Multiple Photos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleMultipleFilesUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="flex items-center gap-1.5 flex-1">
                    <input
                      type="url"
                      placeholder="Or paste photo link (https://...)"
                      value={customImageUrlInput}
                      onChange={(e) => setCustomImageUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomImageUrl();
                        }
                      }}
                      className="w-full p-2 rounded-lg border border-[#E8E3DA] bg-white outline-none text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomImageUrl}
                      className="px-3 py-2 rounded-lg bg-white border border-[#154D4F] text-[#154D4F] hover:bg-[#154D4F] hover:text-white transition-colors text-xs font-semibold shrink-0"
                    >
                      + Add Link
                    </button>
                  </div>
                </div>

                {/* Interactive Multi-Photo Grid */}
                {((packageFormData.galleryImages && packageFormData.galleryImages.length > 0) ||
                  packageFormData.heroImage) && (
                  <div className="pt-2">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-2">
                      Selected Photos (Click 'Set Cover' to choose main card photo)
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-64 overflow-y-auto p-1">
                      {(
                        packageFormData.galleryImages?.length
                          ? packageFormData.galleryImages
                          : packageFormData.heroImage
                          ? [packageFormData.heroImage]
                          : []
                      ).map((imgUrl, idx) => {
                        const isCover = imgUrl === packageFormData.heroImage;
                        return (
                          <div
                            key={idx}
                            className={`relative rounded-xl overflow-hidden border-2 transition-all bg-slate-100 group ${
                              isCover
                                ? 'border-[#C25E34] shadow-sm'
                                : 'border-[#E8E3DA] hover:border-[#154D4F]'
                            }`}
                          >
                            <div className="h-24 w-full overflow-hidden">
                              <img
                                src={imgUrl}
                                alt={`Trip Photo ${idx + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>

                            {/* Top Badges */}
                            <div className="absolute top-1.5 inset-x-1.5 flex items-center justify-between pointer-events-none">
                              {isCover ? (
                                <span className="px-1.5 py-0.5 rounded-md bg-[#C25E34] text-white text-[9px] font-bold flex items-center gap-0.5 shadow-xs">
                                  <Star className="w-2.5 h-2.5 fill-white" />
                                  Cover
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded-md bg-black/60 text-white text-[9px] font-medium">
                                  #{idx + 1}
                                </span>
                              )}

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveGalleryImage(idx);
                                }}
                                className="pointer-events-auto p-1 rounded-md bg-black/70 hover:bg-rose-600 text-white transition-colors"
                                title="Remove photo"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Set As Cover Button */}
                            {!isCover && (
                              <button
                                type="button"
                                onClick={() => handleSetCoverPhoto(imgUrl)}
                                className="w-full py-1 text-[10px] font-semibold bg-white/90 hover:bg-[#154D4F] hover:text-white text-[#154D4F] transition-colors border-t border-[#E8E3DA] text-center"
                              >
                                Set as Cover
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold uppercase text-[#475569]">
                    Planned Route
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const current = packageFormData.route || '';
                      const needsSpace = current.length > 0 && !current.endsWith(' ');
                      const next = current + (needsSpace ? ' → ' : '→ ');
                      setPackageFormData({ ...packageFormData, route: next });
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#154D4F]/40 hover:bg-[#154D4F] hover:text-white text-[#154D4F] text-[11px] font-bold transition-all shadow-2xs active:scale-95"
                    title="Click to insert route arrow"
                  >
                    <span>+ Insert Arrow</span>
                    <span className="text-sm font-bold font-mono">→</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Srinagar (2N) → Gulmarg (1N) → Pahalgam (2N)"
                    value={packageFormData.route || ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/-->/g, '→').replace(/->/g, '→');
                      setPackageFormData({ ...packageFormData, route: val });
                    }}
                    className="w-full p-2.5 pr-12 rounded-lg border border-[#E8E3DA] focus:ring-1 focus:ring-[#C25E34] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const current = packageFormData.route || '';
                      const needsSpace = current.length > 0 && !current.endsWith(' ');
                      const next = current + (needsSpace ? ' → ' : '→ ');
                      setPackageFormData({ ...packageFormData, route: next });
                    }}
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-md bg-[#154D4F]/10 hover:bg-[#154D4F] hover:text-white text-[#154D4F] text-base font-bold flex items-center justify-center transition-colors"
                    title="Insert arrow →"
                  >
                    →
                  </button>
                </div>
                <p className="text-[10px] text-[#64748B] mt-1">
                  Tip: Click <strong>→</strong> or type <strong>-&gt;</strong> on your keyboard to insert route arrows automatically.
                </p>
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#475569] mb-1">
                  Overview & Experience Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the holiday journey..."
                  value={packageFormData.overview || ''}
                  onChange={(e) => setPackageFormData({ ...packageFormData, overview: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#E8E3DA] outline-none"
                />
              </div>

              {/* ========================================================
                  DAY-BY-DAY ITINERARY BUILDER
              ======================================================== */}
              <div className="pt-4 border-t border-[#E8E3DA] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                      <span>Day-by-Day Itinerary</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#154D4F] text-white text-[10px]">
                        {packageFormData.itinerary?.length || 0} Days
                      </span>
                    </h4>
                    <p className="text-[11px] text-[#64748B]">
                      Enter day-wise sightseeing plan, hotel stay, and included meals
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddItineraryDay}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#154D4F] text-[#154D4F] hover:bg-[#154D4F] hover:text-white transition-colors text-xs font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Next Day</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {packageFormData.itinerary?.map((dayItem, index) => (
                    <div
                      key={index}
                      className="p-3.5 rounded-xl border border-[#E8E3DA] bg-[#FAF8F5]/80 space-y-2.5 transition-all hover:border-[#154D4F]/40"
                    >
                      {/* Day Header */}
                      <div className="flex items-center justify-between pb-1.5 border-b border-[#E8E3DA]/60">
                        <span className="px-2.5 py-0.5 rounded-md bg-[#154D4F] text-white text-[11px] font-bold uppercase tracking-wider">
                          Day {dayItem.day || index + 1}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleRemoveItineraryDay(index)}
                          className="text-rose-500 hover:text-rose-700 p-1 text-xs font-semibold flex items-center gap-1 hover:bg-rose-50 rounded"
                          title="Delete this day"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>

                      {/* Day Title */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#475569] mb-1">
                          Day Title / Headline *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Arrival in Srinagar & Dal Lake Sunset Shikara Ride"
                          value={dayItem.title}
                          onChange={(e) => handleUpdateItineraryDay(index, 'title', e.target.value)}
                          className="w-full p-2 rounded-lg border border-[#E8E3DA] bg-white text-xs font-semibold text-[#0F172A] outline-none"
                        />
                      </div>

                      {/* Day Description */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#475569] mb-1">
                          Activities & Sightseeing Plan *
                        </label>
                        <textarea
                          rows={2}
                          required
                          placeholder="Describe the day's excursions, chauffeur pickup times, scenic spots, and leisure..."
                          value={dayItem.description}
                          onChange={(e) => handleUpdateItineraryDay(index, 'description', e.target.value)}
                          className="w-full p-2 rounded-lg border border-[#E8E3DA] bg-white text-xs text-[#334155] outline-none"
                        />
                      </div>

                      {/* Stay & Meals in 2 Columns */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#475569] mb-1">
                            Confirmed Stay / Hotel
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 4-Star Resort or Houseboat"
                            value={dayItem.stay || ''}
                            onChange={(e) => handleUpdateItineraryDay(index, 'stay', e.target.value)}
                            className="w-full p-2 rounded-lg border border-[#E8E3DA] bg-white text-xs outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#475569] mb-1">
                            Meals Included (Comma separated)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Breakfast, Dinner"
                            value={dayItem.mealsIncluded?.join(', ') || ''}
                            onChange={(e) =>
                              handleUpdateItineraryDay(
                                index,
                                'mealsIncluded',
                                e.target.value.split(',').map((m) => m.trim()).filter(Boolean)
                              )
                            }
                            className="w-full p-2 rounded-lg border border-[#E8E3DA] bg-white text-xs outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-[#E8E3DA]">
                <button
                  type="button"
                  onClick={() => setShowPackageModal(false)}
                  className="px-4 py-2.5 rounded-lg border border-[#E8E3DA] text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#C25E34] hover:bg-[#A74E28] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                >
                  {isEditing ? 'Save Changes' : 'Publish Trip to Website'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
