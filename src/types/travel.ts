export type DestinationType = 'domestic' | 'international';

export type TripCategory = 
  | 'Family Vacation'
  | 'Honeymoon & Romance'
  | 'Adventure & Trekking'
  | 'Luxury & Wellness'
  | 'Spiritual & Heritage'
  | 'Group & Corporate'
  | 'Customized Holiday';

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  mealsIncluded?: string[]; // e.g. ['Breakfast', 'Dinner']
  stay?: string; // e.g. '4-Star Premium Resort in Munnar'
  highlights?: string[];
}

export interface TravelPackage {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  destinationType: DestinationType;
  destinationName: string;
  regionOrCountry: string; // e.g. 'Kerala', 'Himachal', 'Switzerland', 'Bali'
  durationNights: number;
  durationDays: number;
  startingPriceINR: number;
  originalPriceINR?: number;
  isPriceVerified?: boolean;
  featured?: boolean;
  badge?: string; // e.g. 'Bestseller', 'Curated Luxury', 'Monsoon Special'
  categories: TripCategory[];
  heroImage: string;
  galleryImages: string[];
  overview: string;
  bestTimeToVisit: string;
  route: string; // e.g. 'Cochin → Munnar → Thekkady → Alleppey → Cochin'
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  hotelCategory: string; // e.g. '3-Star / 4-Star Handpicked Stays'
  cancellationPolicy: string[];
  importantNotes?: string[];
  status: 'published' | 'draft' | 'archived';
}

export interface DestinationInfo {
  id: string;
  slug: string;
  name: string;
  type: DestinationType;
  stateOrCountry: string;
  heroImage: string;
  shortDescription: string;
  bestMonths: string;
  startingPriceINR: number;
  packageCount: number;
  popularHighlights: string[];
  featured?: boolean;
}

export interface CustomerEnquiry {
  id: string;
  createdAt: string;
  fullName: string;
  phone: string;
  email?: string;
  tripType: DestinationType | 'both';
  destinationPreference: string;
  departureCity: string;
  travelDateApprox: string;
  adultsCount: number;
  childrenCount: number;
  approxBudgetINR?: string;
  additionalNotes?: string;
  originPackageSlug?: string;
  originPackageTitle?: string;
  status: 'new' | 'contacted' | 'quoted' | 'converted' | 'archived';
  internalNotes?: string;
}

export interface Testimonial {
  id: string;
  customerName: string;
  city: string;
  tripTitle: string;
  destination: string;
  rating: number; // 1-5
  comment: string;
  travelDate: string;
  avatar?: string;
  verifiedBooking?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'booking' | 'payments' | 'cancellation' | 'customization' | 'general';
}
