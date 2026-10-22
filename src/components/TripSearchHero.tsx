'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Calendar, Compass, ArrowRight, Sparkles } from 'lucide-react';
import { getPublishedPackages } from '@/lib/storage';

export default function TripSearchHero() {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [tripType, setTripType] = useState('all');
  const [category, setCategory] = useState('all');
  const [trendingItems, setTrendingItems] = useState([
    { label: 'Kerala Backwaters', place: 'Kerala', type: 'domestic' as const },
    { label: 'Swiss Alps', place: 'Switzerland', type: 'international' as const },
    { label: 'Bali Villas', place: 'Bali', type: 'international' as const },
    { label: 'Ladakh High Passes', place: 'Ladakh', type: 'domestic' as const },
    { label: 'Royal Rajasthan', place: 'Rajasthan', type: 'domestic' as const },
    { label: 'Dubai Luxury', place: 'Dubai', type: 'international' as const },
  ]);

  useEffect(() => {
    try {
      const pub = getPublishedPackages();
      if (pub && pub.length > 0) {
        const map = new Map<string, { label: string; place: string; type: 'domestic' | 'international' }>();
        for (const p of pub) {
          if (!map.has(p.destinationName)) {
            map.set(p.destinationName, {
              label: p.destinationName,
              place: p.destinationName.split(' ')[0],
              type: p.destinationType,
            });
          }
        }
        if (map.size > 0) {
          setTrendingItems(Array.from(map.values()).slice(0, 6));
        }
      }
    } catch {}
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set('q', destination);
    if (tripType !== 'all') params.set('type', tripType);
    if (category !== 'all') params.set('category', category);

    router.push(`/packages?${params.toString()}`);
  };

  const handleQuickSelect = (place: string, type: 'all' | 'domestic' | 'international') => {
    setDestination(place);
    setTripType(type);
    const params = new URLSearchParams();
    params.set('q', place);
    if (type !== 'all') params.set('type', type);
    router.push(`/packages?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto -mt-16 sm:-mt-22 relative z-30 px-4">
      <div className="bg-white/98 backdrop-blur-xl p-4 sm:py-5 sm:px-7 rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_-15px_rgba(15,23,42,0.12)] border border-[#E8E3DA] transition-all">
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 items-center"
        >
          {/* Field 1: Destination input */}
          <div className="p-2.5 sm:p-3 rounded-xl hover:bg-[#FAF8F5] transition-colors border-b md:border-b-0 md:border-r border-[#E8E3DA]/80">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#154D4F] mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C25E34]" />
              <span>Where To?</span>
            </label>
            <input
              type="text"
              placeholder="Kashmir, Switzerland, Bali..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full text-sm font-semibold text-[#0F172A] placeholder-[#94A3B8] bg-transparent focus:outline-none"
            />
          </div>

          {/* Field 2: Region / Trip Type */}
          <div className="p-2.5 sm:p-3 rounded-xl hover:bg-[#FAF8F5] transition-colors border-b md:border-b-0 md:border-r border-[#E8E3DA]/80">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#154D4F] mb-1.5 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#C25E34]" />
              <span>Region</span>
            </label>
            <select
              value={tripType}
              onChange={(e) => setTripType(e.target.value)}
              className="w-full text-sm font-semibold text-[#0F172A] bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="all">All Destinations</option>
              <option value="domestic">India (Domestic)</option>
              <option value="international">Global (International)</option>
            </select>
          </div>

          {/* Field 3: Travel Theme / Category */}
          <div className="p-2.5 sm:p-3 rounded-xl hover:bg-[#FAF8F5] transition-colors border-b md:border-b-0 md:border-r border-[#E8E3DA]/80">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#154D4F] mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#C25E34]" />
              <span>Travel Theme</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-sm font-semibold text-[#0F172A] bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="all">All Experiences</option>
              <option value="Honeymoon & Romance">Honeymoon & Romance</option>
              <option value="Family Vacation">Family Vacation</option>
              <option value="Adventure & Trekking">Adventure & Nature</option>
              <option value="Luxury & Wellness">Luxury & Wellness</option>
              <option value="Spiritual & Heritage">Heritage & Culture</option>
            </select>
          </div>

          {/* Search CTA */}
          <div className="pt-2 md:pt-0">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#C25E34] to-[#A74E28] hover:from-[#A74E28] hover:to-[#8E3F1E] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] group cursor-pointer"
            >
              <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Search Tours</span>
            </button>
          </div>
        </form>

        {/* Quick-pill suggestions */}
        <div className="mt-3.5 pt-3 border-t border-[#E8E3DA]/60 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#64748B] font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#C58B3E]" />
            Trending:
          </span>
          {trendingItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleQuickSelect(item.place, item.type)}
              className="px-2.5 py-1 rounded-full bg-[#FAF8F5] hover:bg-[#154D4F] hover:text-white text-[#154D4F] border border-[#E8E3DA] text-[11px] font-semibold transition-all duration-150 cursor-pointer shadow-2xs"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
