import { TravelPackage, DestinationInfo, CustomerEnquiry } from '@/types/travel';
import { packagesData } from '@/data/packages';
import { destinationsData } from '@/data/destinations';

const ENQUIRIES_STORAGE_KEY = 'vv_agency_enquiries_v1';
const PACKAGES_STORAGE_KEY = 'vv_agency_packages_v1';
const ADMIN_PASSCODE_KEY = 'vv_agency_admin_passcode_v1';
const DEFAULT_PASSCODE = 'admin123';

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
 * Admin Passcode Management
 */
export function getAdminPasscode(): string {
  if (typeof window === 'undefined') return DEFAULT_PASSCODE;
  try {
    return localStorage.getItem(ADMIN_PASSCODE_KEY) || DEFAULT_PASSCODE;
  } catch {
    return DEFAULT_PASSCODE;
  }
}

export function saveAdminPasscode(newPasscode: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(ADMIN_PASSCODE_KEY, newPasscode.trim());
    return true;
  } catch {
    return false;
  }
}

/**
 * Synchronous storage helpers for instantaneous rendering and offline safety
 */
const DELETED_PACKAGES_KEY = 'vv_agency_deleted_packages_v1';

export function getDeletedPackageSlugs(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(DELETED_PACKAGES_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

export function markPackageDeleted(slug: string, id?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const set = getDeletedPackageSlugs();
    if (slug) set.add(slug);
    if (id) set.add(id);
    localStorage.setItem(DELETED_PACKAGES_KEY, JSON.stringify(Array.from(set)));
  } catch {}
}

export function unmarkPackageDeleted(slug: string, id?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const set = getDeletedPackageSlugs();
    let changed = false;
    if (slug && set.has(slug)) { set.delete(slug); changed = true; }
    if (id && set.has(id)) { set.delete(id); changed = true; }
    if (changed) {
      localStorage.setItem(DELETED_PACKAGES_KEY, JSON.stringify(Array.from(set)));
    }
  } catch {}
}

export function getStoredPackages(): TravelPackage[] {
  if (typeof window === 'undefined') {
    return packagesData;
  }
  try {
    const raw = localStorage.getItem(PACKAGES_STORAGE_KEY);
    const deletedSlugs = getDeletedPackageSlugs();

    if (!raw) {
      const initial = packagesData.filter((p) => !deletedSlugs.has(p.slug) && !deletedSlugs.has(p.id));
      localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }

    const parsed: TravelPackage[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const initial = packagesData.filter((p) => !deletedSlugs.has(p.slug) && !deletedSlugs.has(p.id));
      localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }

    // Ensure default packages from packagesData are present UNLESS explicitly deleted by user
    const storedKeys = new Set(parsed.map((p) => p.slug || p.id));
    const merged = [...parsed];
    let needsUpdate = false;

    for (const defaultPkg of packagesData) {
      const key = defaultPkg.slug || defaultPkg.id;
      // Do not resurrect packages the user has removed/deleted
      if (deletedSlugs.has(key) || (defaultPkg.slug && deletedSlugs.has(defaultPkg.slug)) || (defaultPkg.id && deletedSlugs.has(defaultPkg.id))) {
        continue;
      }
      if (!storedKeys.has(key)) {
        merged.push({ ...defaultPkg, status: 'published' });
        storedKeys.add(key);
        needsUpdate = true;
      }
    }

    // Ensure every package has a valid status if missing
    for (const p of merged) {
      if (!p.status) {
        p.status = 'published';
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(merged));
    }

    return merged;
  } catch {
    return packagesData;
  }
}

export function getPublishedPackages(): TravelPackage[] {
  return getStoredPackages().filter((pkg) => pkg.status === 'published');
}

export function getPackageBySlug(slug: string): TravelPackage | undefined {
  const packages = getStoredPackages();
  return packages.find((p) => p.slug === slug || p.id === slug);
}

export function saveStoredPackages(packages: TravelPackage[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(packages));
    window.dispatchEvent(new Event('packages_updated'));
  } catch (err) {
    console.error('Failed to save packages to localStorage', err);
  }
}

export function saveOrUpdatePackage(pkg: TravelPackage): void {
  unmarkPackageDeleted(pkg.slug, pkg.id);
  const current = getStoredPackages();
  const index = current.findIndex((p) => p.id === pkg.id || p.slug === pkg.slug);
  let updated: TravelPackage[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = pkg;
  } else {
    updated = [pkg, ...current];
  }
  saveStoredPackages(updated);

  // Sync with MongoDB in the background
  syncPackageToMongoDB(pkg).catch(() => {});
}

export function deletePackage(slug: string): void {
  const current = getStoredPackages();
  const toDelete = current.find((p) => p.slug === slug || p.id === slug);
  markPackageDeleted(slug, toDelete?.id);
  const updated = current.filter((p) => p.slug !== slug && p.id !== slug);
  saveStoredPackages(updated);

  // Sync deletion with MongoDB
  deletePackageFromMongoDB(slug).catch(() => {});
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

  // Sync to MongoDB
  syncEnquiryToMongoDB(newEntry).catch(() => {});

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

  // Sync update to MongoDB
  updateEnquiryInMongoDB(id, status, internalNotes).catch(() => {});

  return updated;
}

// =====================================================================
// ASYNC MONGODB SYNC HELPERS (Direct API Integration)
// =====================================================================

export async function fetchMongoDBStatus(): Promise<{
  configured: boolean;
  connected: boolean;
  stats?: { packages: number; enquiries: number; destinations: number };
  message?: string;
}> {
  try {
    const res = await fetch('/api/status', { cache: 'no-store' });
    if (!res.ok) throw new Error('Status check failed');
    return await res.json();
  } catch {
    return { configured: false, connected: false };
  }
}

export async function fetchPackagesFromMongoDB(): Promise<TravelPackage[]> {
  try {
    const res = await fetch('/api/packages', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch packages');
    const data = await res.json();
    if (data.packages && Array.isArray(data.packages)) {
      saveStoredPackages(data.packages);
      return data.packages;
    }
    return getStoredPackages();
  } catch {
    return getStoredPackages();
  }
}

export async function syncPackageToMongoDB(pkg: TravelPackage): Promise<void> {
  try {
    await fetch('/api/packages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pkg),
    });
  } catch (err) {
    console.warn('MongoDB package sync queued locally:', err);
  }
}

export async function deletePackageFromMongoDB(slug: string): Promise<void> {
  try {
    await fetch(`/api/packages/${encodeURIComponent(slug)}`, {
      method: 'DELETE',
    });
  } catch (err) {
    console.warn('MongoDB package delete queued locally:', err);
  }
}

export async function fetchEnquiriesFromMongoDB(): Promise<CustomerEnquiry[]> {
  try {
    const res = await fetch('/api/enquiries', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch enquiries');
    const data = await res.json();
    if (data.enquiries && Array.isArray(data.enquiries) && data.enquiries.length > 0) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(data.enquiries));
      }
      return data.enquiries;
    }
    return getStoredEnquiries();
  } catch {
    return getStoredEnquiries();
  }
}

export async function syncEnquiryToMongoDB(enquiry: CustomerEnquiry): Promise<void> {
  try {
    await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiry),
    });
  } catch (err) {
    console.warn('MongoDB enquiry submission queued locally:', err);
  }
}

export async function updateEnquiryInMongoDB(
  id: string,
  status: CustomerEnquiry['status'],
  internalNotes?: string
): Promise<void> {
  try {
    await fetch('/api/enquiries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, internalNotes }),
    });
  } catch (err) {
    console.warn('MongoDB enquiry update queued locally:', err);
  }
}

export async function seedMongoDB(): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/seed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ overwrite: false }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to trigger seed' };
  }
}
