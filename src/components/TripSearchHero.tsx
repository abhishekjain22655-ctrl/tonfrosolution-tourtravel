'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Calendar, Compass, ArrowRight } from 'lucide-react';

export default function TripSearchHero() {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [tripType, setTripType] = useState('all');
  const [category, setCategory] = useState('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set('q', destination);
    if (tripType !== 'all') params.set('type', tripType);
    if (category !== 'all') params.set('category', category);

    router.push(`/packages?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto -mt-10 sm:-mt-14 relative z-30 px-4">
      <form
        onSubmit={handleSearch}
        className="bg-white/95 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-xl border border-[#E8E3DA] grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
      >
        {/* Field 1: Destination input */}
        <div className="border-b md:border-b-0 md:border-r border-[#E8E3DA] pb-3 md:pb-0 md:pr-4">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#154D4F] mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#C25E34]" />
            Where to?
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
        <div className="border-b md:border-b-0 md:border-r border-[#E8E3DA] pb-3 md:pb-0 md:pr-4">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#154D4F] mb-1 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#C25E34]" />
            Region
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
        <div className="border-b md:border-b-0 md:border-r border-[#E8E3DA] pb-3 md:pb-0 md:pr-4">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#154D4F] mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#C25E34]" />
            Travel Theme
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
        <div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#C25E34] hover:bg-[#A74E28] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg"
          >
            <Search className="w-4 h-4" />
            <span>Search Tours</span>
          </button>
        </div>
      </form>
    </div>
  );
}
