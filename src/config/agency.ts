/**
 * =========================================================================
 * 🏢 COMPANY & AGENCY CONFIGURATION (SINGLE SOURCE OF TRUTH)
 * =========================================================================
 * 
 * IMPORTANT: You can easily update your company details right here!
 * All components, navigation menus, footers, WhatsApp links, and enquiry forms
 * automatically pull from this file.
 * 
 * When your company details are ready:
 * 1. Change `companyName`, `shortName`, `tagline` below.
 * 2. Update `phone`, `whatsappNumber`, and `email`.
 * 3. Update office address, registered certifications, and social links.
 * 
 * =========================================================================
 */

export interface AgencyConfig {
  companyName: string;
  legalEntityName: string;
  shortName: string;
  tagline: string;
  description: string;
  establishedYear: number;
  
  // Contact & Support
  contact: {
    primaryPhone: string;
    displayPhone: string;
    secondaryPhone?: string;
    whatsappNumber: string; // International format without '+' e.g., '919876543210'
    whatsappDisplay: string;
    email: string;
    bookingEmail: string;
    supportEmail: string;
    workingHours: string;
    officeAddress: {
      street: string;
      locality: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
      mapEmbedUrl?: string;
    };
    branchOffices?: Array<{
      city: string;
      address: string;
      phone: string;
    }>;
  };

  // Legal, Trust & Accreditations (Clearly labeled)
  accreditations: {
    gstNumberPlaceholder: string;
    cinPlaceholder?: string;
    iataMember: boolean;
    ministryOfTourismApproved: boolean;
    registeredAgencyBadgeText: string;
    trustNote: string;
  };

  // Social Links
  socials: {
    instagram: string;
    facebook: string;
    youtube?: string;
    linkedin?: string;
    twitter?: string;
  };

  // Default SEO & Metadata
  seo: {
    siteUrl: string;
    defaultTitle: string;
    titleTemplate: string;
    defaultDescription: string;
    ogImage: string;
    keywords: string[];
  };

  // Quick WhatsApp Pre-fill message templates
  whatsappTemplates: {
    generalEnquiry: (name?: string) => string;
    packageEnquiry: (packageTitle: string, duration: string) => string;
    customTripEnquiry: (destination: string, dates?: string) => string;
  };
}

export const agencyConfig: AgencyConfig = {
  companyName: "Vana & Vistas Journeys",
  legalEntityName: "Vana & Vistas Holidays Pvt. Ltd. (Sample Registered Entity)",
  shortName: "Vana & Vistas",
  tagline: "Curated Indian & International Journeys, Handcrafted With Soul",
  description:
    "We design immersive, high-comfort holidays across the Indian subcontinent and world-renowned global destinations. With zero hidden fees, verified luxury stays, and dedicated 24/7 on-trip concierge care.",
  establishedYear: 2018,

  contact: {
    primaryPhone: "+919876543210",
    displayPhone: "+91 98765 43210",
    secondaryPhone: "+91 11 4050 6070",
    whatsappNumber: "919876543210", // 91 + 10 digits (no spaces or plus)
    whatsappDisplay: "+91 98765 43210",
    email: "holidays@vanavistas.com",
    bookingEmail: "bookings@vanavistas.com",
    supportEmail: "concierge@vanavistas.com",
    workingHours: "Monday – Saturday: 9:30 AM to 7:30 PM IST (24/7 on-trip assistance)",
    officeAddress: {
      street: "Suite 402, Signature Pinnacle, M.G. Road",
      locality: "Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
      country: "India",
    },
    branchOffices: [
      {
        city: "New Delhi",
        address: "Level 3, Connaught Place Outer Circle, New Delhi 110001",
        phone: "+91 11 4050 6071",
      },
      {
        city: "Mumbai",
        address: "Bandra Kurla Complex, G-Block, Mumbai 400051",
        phone: "+91 22 6120 8090",
      },
    ],
  },

  accreditations: {
    gstNumberPlaceholder: "29AAAAA0000A1Z5 (Demo GSTIN)",
    cinPlaceholder: "U63040KA2018PTC112233",
    iataMember: true,
    ministryOfTourismApproved: true,
    registeredAgencyBadgeText: "Verified Tour Operator • MoT & IATA Accredited Partner",
    trustNote: "Sample company data displayed. Replace with verified business details in agency.ts",
  },

  socials: {
    instagram: "https://instagram.com/sample_travel_agency",
    facebook: "https://facebook.com/sample_travel_agency",
    youtube: "https://youtube.com/@sample_travel_agency",
    linkedin: "https://linkedin.com/company/sample-travel-agency",
  },

  seo: {
    siteUrl: "https://vanavistas.com",
    defaultTitle: "Vana & Vistas | Premium Indian & International Holiday Experiences",
    titleTemplate: "%s | Vana & Vistas Journeys",
    defaultDescription:
      "Explore handcrafted domestic holidays across Kashmir, Kerala, Ladakh, Rajasthan and bespoke international tours to Switzerland, Bali, Dubai, Vietnam & Europe.",
    ogImage: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=1200&auto=format&fit=crop",
    keywords: [
      "luxury travel agency India",
      "Kashmir tour packages",
      "Kerala backwater packages",
      "Europe holiday packages from India",
      "Bali honeymoon tour",
      "Dubai luxury holiday",
      "customized tour operator India",
    ],
  },

  whatsappTemplates: {
    generalEnquiry: (name?: string) =>
      encodeURIComponent(
        `Hello ${name ? name : "Vana & Vistas Team"}! I am planning a holiday and would like to speak with a travel specialist regarding your holiday packages.`
      ),
    packageEnquiry: (packageTitle: string, duration: string) =>
      encodeURIComponent(
        `Hello! I am interested in booking the "${packageTitle}" (${duration}). Please share the detailed itinerary, available dates, and best quote.`
      ),
    customTripEnquiry: (destination: string, dates?: string) =>
      encodeURIComponent(
        `Hello! I'd like to plan a custom trip to ${destination}${dates ? ` around ${dates}` : ""}. Could you connect me with a destination curator?`
      ),
  },
};

/**
 * Helper to generate direct WhatsApp chat links with encoded messages
 */
export function getWhatsAppLink(message?: string): string {
  const text = message || agencyConfig.whatsappTemplates.generalEnquiry();
  return `https://wa.me/${agencyConfig.contact.whatsappNumber}?text=${text}`;
}

/**
 * Helper to generate tel: call link
 */
export function getPhoneLink(): string {
  return `tel:${agencyConfig.contact.primaryPhone}`;
}
