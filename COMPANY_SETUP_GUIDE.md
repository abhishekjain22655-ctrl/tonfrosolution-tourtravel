# 🌍 Company Information & Setup Guide

This project is built with a **Single Source of Truth** architecture so that adding or updating your official company details, phone numbers, WhatsApp, addresses, and holiday packages is effortless.

---

## 1. Updating Your Company Details (One File Only!)

All contact numbers, office addresses, WhatsApp links, legal entity names, GSTIN, and headers/footers pull dynamically from:

👉 **[src/config/agency.ts](file:///c:/Users/Lenovo/Desktop/travelll/src/config/agency.ts)**

When you are ready to upload your real data, simply open that file and change:
* **Company Name & Tagline**:
  ```ts
  companyName: "Your Travel Company Name",
  shortName: "Your Brand",
  tagline: "Your Custom Tagline",
  ```
* **Official Phone & WhatsApp**:
  ```ts
  primaryPhone: "+91 98765 43210",
  whatsappNumber: "919876543210", // 91 + 10 digits without '+' or spaces
  ```
* **Email & Addresses**:
  ```ts
  email: "holidays@yourdomain.com",
  bookingEmail: "bookings@yourdomain.com",
  officeAddress: {
    street: "Your Building, Street",
    city: "Your City",
    state: "Your State",
    pincode: "000000",
    country: "India"
  }
  ```
* **Legal & Accreditations**:
  ```ts
  gstNumberPlaceholder: "07AAAAA0000A1Z5",
  iataMember: true,
  ministryOfTourismApproved: true,
  ```

---

## 2. Managing Packages & Destinations

You can manage packages in two friendly ways:

### Option A: Via the Web Admin Portal (`/admin`)
1. Visit **`http://localhost:3000/admin`** in your browser.
2. Sign in with the default staff passcode: **`admin123`** (or `travel2026`).
3. View all submitted customer enquiries, change lead statuses (`New`, `Contacted`, `Quoted`, `Converted`), add internal notes, and click **"WhatsApp"** to reply with one click.
4. Add new holiday packages or toggle packages between `published` and `draft`.

### Option B: Directly in the Codebase
* Master Packages List: **[src/data/packages.ts](file:///c:/Users/Lenovo/Desktop/travelll/src/data/packages.ts)**
* Master Destinations: **[src/data/destinations.ts](file:///c:/Users/Lenovo/Desktop/travelll/src/data/destinations.ts)**
* Customer Testimonials: **[src/data/testimonials.ts](file:///c:/Users/Lenovo/Desktop/travelll/src/data/testimonials.ts)**
* Frequently Asked Questions: **[src/data/faq.ts](file:///c:/Users/Lenovo/Desktop/travelll/src/data/faq.ts)**

---

## 3. Connecting Supabase Database (When Ready)

The application currently operates with a **persistent client storage fallback** so all form submissions and package additions work immediately without errors.

When you're ready to connect a live Supabase PostgreSQL database:
1. Copy the SQL script in **[supabase-schema.sql](file:///c:/Users/Lenovo/Desktop/travelll/supabase-schema.sql)** into your Supabase SQL Editor and run it.
2. Add your Supabase URL and Anon Key to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
