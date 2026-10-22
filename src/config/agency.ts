/**
 * =========================================================================
 * 🏢 COMPANY & AGENCY CONFIGURATION (SINGLE SOURCE OF TRUTH)
 * =========================================================================
 * 
 * Official Company Details:
 * Tonfro Solution Tour and Travel
 * Primary Market: India (Domestic & International Travel)
 * Contact Number: +91 8796969992
 * Business Email: Tonfrosolutionpvtltd@gmail.com
 * Address: Office No. 304, Third Floor, Khasra No. 502/348, Vats Market, Pitampura Village, New Delhi, Delhi – 110034, India
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
    whatsappNumber: string; // International format without '+' e.g. '918796969992'
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
      landmark?: string;
      mapEmbedUrl?: string;
    };
    branchOffices?: Array<{
      city: string;
      address: string;
      phone: string;
    }>;
  };

  // Legal, Trust & Accreditations
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
  companyName: "Tonfro Solution Tour and Travel",
  legalEntityName: "Tonfro Solution Tour and Travel",
  shortName: "Tonfro Travel",
  tagline: "Discover the World. Experience More.",
  description:
    "Tonfro Solution Tour and Travel helps travellers explore domestic and international destinations through thoughtfully presented holiday options and personalized travel enquiries. Discover destinations, explore travel packages, and connect with our team to plan your next journey.",
  establishedYear: 2024,

  contact: {
    primaryPhone: "+918796969992",
    displayPhone: "+91 8796969992",
    secondaryPhone: "+91 8796969992",
    whatsappNumber: "918796969992", // 91 + 10 digits
    whatsappDisplay: "+91 8796969992",
    email: "Tonfrosolutionpvtltd@gmail.com",
    bookingEmail: "Tonfrosolutionpvtltd@gmail.com",
    supportEmail: "Tonfrosolutionpvtltd@gmail.com",
    workingHours: "Monday – Saturday: 9:30 AM to 7:00 PM IST",
    officeAddress: {
      street: "Office No. 304, Third Floor, Khasra No. 502/348",
      locality: "Vats Market, Pitampura Village",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110034",
      country: "India",
      landmark: "Vats Market",
    },
    branchOffices: [
      {
        city: "New Delhi (Head Office)",
        address: "Office No. 304, Third Floor, Khasra No. 502/348, Vats Market, Pitampura Village, New Delhi, Delhi – 110034, India",
        phone: "+91 8796969992",
      },
    ],
  },

  accreditations: {
    gstNumberPlaceholder: "Registered in New Delhi, India",
    cinPlaceholder: "Tour and Travel Agency",
    iataMember: false,
    ministryOfTourismApproved: false,
    registeredAgencyBadgeText: "Registered Tour & Travel Operator • New Delhi, India",
    trustNote: "Official verified details for Tonfro Solution Tour and Travel",
  },

  socials: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/",
    linkedin: "https://linkedin.com/",
  },

  seo: {
    siteUrl: "https://tonfrosolution.com",
    defaultTitle: "Tonfro Solution Tour and Travel | Domestic & International Holidays",
    titleTemplate: "%s | Tonfro Solution Tour and Travel",
    defaultDescription:
      "Explore domestic and international holiday destinations with Tonfro Solution Tour and Travel. Discover travel packages and contact our team to enquire about your next trip.",
    ogImage: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=1200&auto=format&fit=crop",
    keywords: [
      "Tonfro Solution Tour and Travel",
      "travel agency New Delhi",
      "Pitampura travel agency",
      "domestic holiday packages",
      "international holiday packages",
      "Kashmir tour packages",
      "Kerala holiday packages",
      "Dubai tour packages",
      "customized tour operator India",
    ],
  },

  whatsappTemplates: {
    generalEnquiry: (name?: string) =>
      encodeURIComponent(
        `Hello Tonfro Solution Tour and Travel, I would like to enquire about your travel packages. Please share the available options and details.`
      ),
    packageEnquiry: (packageTitle: string, duration: string) =>
      encodeURIComponent(
        `Hello Tonfro Solution Tour and Travel, I am interested in booking the "${packageTitle}" (${duration}). Please share the available dates, itinerary, and best quote.`
      ),
    customTripEnquiry: (destination: string, dates?: string) =>
      encodeURIComponent(
        `Hello Tonfro Solution Tour and Travel, I would like to plan a custom trip to ${destination}${dates ? ` around ${dates}` : ""}. Could you connect me with a consultant?`
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
