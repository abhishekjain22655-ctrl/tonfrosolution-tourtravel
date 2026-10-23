'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, SlidersHorizontal, MapPin, Tag, RefreshCcw } from 'lucide-react';
import { packagesData } from '@/data/packages';
import PackageCard from '@/components/PackageCard';
import { TripCategory, TravelPackage } from '@/types/travel';
import { getPublishedPackages, fetchPackagesFromMongoDB } from '@/lib/storage';

function PackagesFilterContent() {
  const [packagesList, setPackagesList] = useState<TravelPackage[]>([]);

  useEffect(() => {
    // 1. Immediately populate from local cache
    setPackagesList(getPublishedPackages());

    // 2. Fetch live data from MongoDB API to ensure real-time draft/publish states across devices
    fetchPackagesFromMongoDB().then((allPkgs) => {
      if (Array.isArray(allPkgs) && allPkgs.length > 0) {
        setPackagesList(allPkgs.filter((p) => p.status === 'published'));
      }
    }).catch(() => {});

    const handleUpdate = () => {
      setPackagesList(getPublishedPackages());
    };
    window.addEventListener('packages_updated', handleUpdate);
    return () => window.removeEventListener('packages_updated', handleUpdate);
  }, []);

  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') || 'all';
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';
  const initialDest = searchParams.get('destination') || '';

  const [typeFilter, setTypeFilter] = useState<string>(initialType);
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory);
  const [maxBudget, setMaxBudget] = useState<number>(200000);
  const [durationFilter, setDurationFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery || initialDest);

  const categories: TripCategory[] = [
    'Honeymoon & Romance',
    'Family Vacation',
    'Adventure & Trekking',
    'Luxury & Wellness',
    'Spiritual & Heritage',
    'Customized Holiday',
  ];

  const filteredPackages = useMemo(() => {
    return packagesList.filter((pkg) => {
      // Strict filter: Never show draft or non-published packages
      if (pkg.status !== 'published') return false;

      // Type filter (domestic vs international)
      if (typeFilter !== 'all' && pkg.destinationType !== typeFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && !pkg.categories.includes(categoryFilter as TripCategory)) {
        return false;
      }

      // Budget filter
      if (pkg.startingPriceINR > maxBudget) {
        return false;
      }

      // Duration filter
      if (durationFilter === 'short' && pkg.durationDays > 5) return false;
      if (durationFilter === 'medium' && (pkg.durationDays <= 5 || pkg.durationDays > 7)) return false;
      if (durationFilter === 'long' && pkg.durationDays <= 7) return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = pkg.title.toLowerCase().includes(q);
        const matchesDest = pkg.destinationName.toLowerCase().includes(q);
        const matchesRegion = pkg.regionOrCountry.toLowerCase().includes(q);
        const matchesOverview = pkg.overview.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDest && !matchesRegion && !matchesOverview) {
          return false;
        }
      }

      return true;
    });
  }, [packagesList, typeFilter, categoryFilter, maxBudget, durationFilter, searchQuery]);

  const handleReset = () => {
    setTypeFilter('all');
    setCategoryFilter('all');
    setMaxBudget(200000);
    setDurationFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Page Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C25E34] block mb-2">
            Curated Holiday Catalog
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-[#0F172A] mb-3">
            Explore Handcrafted Packages
          </h1>
          <p className="text-sm text-[#64748B]">
            From the Himalayan valleys of Kashmir and Ladakh to Switzerland and Bali. Filter by duration, budget, and travel style.
          </p>
        </div>

        {/* Filter & Listing Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Left Column: Filters Sidebar */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E3DA] shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E3DA]">
              <div className="flex items-center gap-2 font-bold text-sm text-[#0F172A]">
                <SlidersHorizontal className="w-4 h-4 text-[#C25E34]" />
                <span>Refine Search</span>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-[#64748B] hover:text-[#C25E34] flex items-center gap-1 font-medium transition-colors"
              >
                <RefreshCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Keyword / Destination search */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-2">
                Search Destination
              </label>
              <input
                type="text"
                placeholder="e.g. Kashmir, Munnar, Bali..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8E3DA] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C25E34]"
              />
            </div>

            {/* Region / Type Filter */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-2">
                Region
              </label>
              <div className="space-y-1.5">
                {[
                  {
                    label: `All Regions (${packagesList.filter((p) => p.status === 'published' || !p.status).length})`,
                    value: 'all',
                  },
                  {
                    label: `India (Domestic) (${packagesList.filter((p) => (p.status === 'published' || !p.status) && p.destinationType === 'domestic').length})`,
                    value: 'domestic',
                  },
                  {
                    label: `Global (International) (${packagesList.filter((p) => (p.status === 'published' || !p.status) && p.destinationType === 'international').length})`,
                    value: 'international',
                  },
                ].map((item) => (
                  <label
                    key={item.value}
                    className="flex items-center gap-2.5 text-xs text-[#334155] cursor-pointer hover:text-[#0F172A]"
                  >
                    <input
                      type="radio"
                      name="regionType"
                      checked={typeFilter === item.value}
                      onChange={() => setTypeFilter(item.value)}
                      className="text-[#C25E34] focus:ring-[#C25E34]"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Travel Category */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-2">
                Travel Style
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8E3DA] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C25E34]"
              >
                <option value="all">All Styles</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration Filter */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-2">
                Trip Duration
              </label>
              <div className="space-y-1.5">
                {[
                  { label: 'Any Duration', value: 'all' },
                  { label: 'Quick Escapes (Up to 5 Days)', value: 'short' },
                  { label: 'Classic Journeys (6 to 7 Days)', value: 'medium' },
                  { label: 'Grand Expeditions (8+ Days)', value: 'long' },
                ].map((d) => (
                  <label
                    key={d.value}
                    className="flex items-center gap-2.5 text-xs text-[#334155] cursor-pointer hover:text-[#0F172A]"
                  >
                    <input
                      type="radio"
                      name="duration"
                      checked={durationFilter === d.value}
                      onChange={() => setDurationFilter(d.value)}
                      className="text-[#C25E34] focus:ring-[#C25E34]"
                    />
                    <span>{d.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Budget Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold uppercase tracking-wider text-[#475569]">
                  Max Price / Guest
                </span>
                <span className="font-bold text-[#154D4F]">
                  ₹{maxBudget.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min={20000}
                max={250000}
                step={5000}
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full accent-[#C25E34]"
              />
              <div className="flex justify-between text-[10px] text-[#94A3B8] mt-1">
                <span>₹20,000</span>
                <span>₹2,50,000+</span>
              </div>
            </div>
          </div>

          {/* Right Column: Packages Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-medium text-[#64748B]">
                Showing <strong className="text-[#0F172A]">{filteredPackages.length}</strong> verified itineraries
              </p>
            </div>

            {filteredPackages.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white rounded-2xl border border-[#E8E3DA]">
                <MapPin className="w-10 h-10 text-[#C58B3E] mx-auto mb-3" />
                <h3 className="text-xl font-serif-luxury font-bold text-[#0F172A] mb-1">
                  No packages match your specific filters
                </h3>
                <p className="text-xs text-[#64748B] max-w-md mx-auto mb-6">
                  Try adjusting the budget slider or selecting &ldquo;All Regions&rdquo;, or request a custom-built package.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-lg bg-[#154D4F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#C25E34] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPackages.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PackagesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-[#64748B]">Loading holiday portfolio...</div>}>
      <PackagesFilterContent />
    </Suspense>
  );
}
