import { TravelPackage, DestinationInfo, CustomerEnquiry } from '@/types/travel';
import { packagesData } from '@/data/packages';
import { destinationsData } from '@/data/destinations';

const ENQUIRIES_STORAGE_KEY = 'vv_agency_enquiries_v1';
const PACKAGES_STORAGE_KEY = 'vv_agency_packages_v1';

/**
 * Initial sample enquiries for demonstration
 */
const initialSampleEnquiries: CustomerEnquiry[] = [
  {
    id: 'enq-101',
    createdAt: '2026-04-10T10:30:00.000Z',
    fullName: 'Rahul Mehra',
    phone: '+91 98112 34567',
    email: 'rahul.mehra@example.com',
    tripType: 'domestic',
    destinationPreference: 'Kashmir Valley',
    departureCity: 'Delhi',
    travelDateApprox: 'May 2026',
    adultsCount: 2,
    childrenCount: 1,
    approxBudgetINR: '₹75,000 - ₹1,00,000',
    additionalNotes: 'Interested in Gulmarg Gondola Phase 2 and Dal Lake luxury houseboat.',
    originPackageSlug: 'kashmir-paradise-on-earth',
    originPackageTitle: 'Kashmir: Paradise on Earth & Houseboat Luxury',
    status: 'new',
  },
  {
    id: 'enq-102',
    createdAt: '2026-04-09T14:15:00.000Z',
    fullName: 'Priya Sundaram',
    phone: '+91 94440 88990',
    email: 'priya.sundaram@example.com',
    tripType: 'international',
    destinationPreference: 'Switzerland',
    departureCity: 'Chennai',
    travelDateApprox: 'June 2026',
    adultsCount: 2,
    childrenCount: 0,
    approxBudgetINR: '₹3,50,000 - ₹4,00,000',
    additionalNotes: 'Honeymoon trip with Swiss Travel Pass 1st class upgrade request.',
    originPackageSlug: 'swiss-alps-panoramic-dream',
    originPackageTitle: 'Swiss Alps & Glaciers: Zurich, Lucerne & Interlaken',
    status: 'contacted',
    internalNotes: 'Shared initial itinerary PDF via email; awaiting date confirmation.',
  },
];

/**
 * Storage helpers that work seamlessly in SSR and browser
 */
export function getStoredPackages(): TravelPackage[] {
  if (typeof window === 'undefined') {
    return packagesData;
  }
  try {
    const raw = localStorage.getItem(PACKAGES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(packagesData));
      return packagesData;
    }
    return JSON.parse(raw);
  } catch {
    return packagesData;
  }
}

export function saveStoredPackages(packages: TravelPackage[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(packages));
  } catch (err) {
    console.error('Failed to save packages to localStorage', err);
  }
}

export function getStoredEnquiries(): CustomerEnquiry[] {
  if (typeof window === 'undefined') {
    return initialSampleEnquiries;
  }
  try {
    const raw = localStorage.getItem(ENQUIRIES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(initialSampleEnquiries));
      return initialSampleEnquiries;
    }
    return JSON.parse(raw);
  } catch {
    return initialSampleEnquiries;
  }
}

export function saveNewEnquiry(enquiry: Omit<CustomerEnquiry, 'id' | 'createdAt' | 'status'>): CustomerEnquiry {
  const newEntry: CustomerEnquiry = {
    ...enquiry,
    id: `enq-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'new',
  };

  if (typeof window !== 'undefined') {
    try {
      const current = getStoredEnquiries();
      const updated = [newEntry, ...current];
      localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save enquiry in storage', err);
    }
  }

  return newEntry;
}

export function updateEnquiryStatus(
  id: string,
  status: CustomerEnquiry['status'],
  internalNotes?: string
): CustomerEnquiry[] {
  if (typeof window === 'undefined') return initialSampleEnquiries;
  const current = getStoredEnquiries();
  const updated = current.map((enq) => {
    if (enq.id === id) {
      return {
        ...enq,
        status,
        ...(internalNotes !== undefined ? { internalNotes } : {}),
      };
    }
    return enq;
  });
  localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
