-- =====================================================================
-- SUPABASE DATABASE SCHEMA FOR TRAVEL AGENCY PLATFORM
-- =====================================================================
-- This script configures PostgreSQL tables, relations, and Row Level Security (RLS)
-- for the travel agency web application when you connect a live Supabase project.

-- 1. DESTINATIONS TABLE
CREATE TABLE IF NOT EXISTS public.destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('domestic', 'international')),
  state_or_country TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  short_description TEXT NOT NULL,
  best_months TEXT,
  starting_price_inr INTEGER NOT NULL DEFAULT 0,
  package_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. PACKAGES TABLE
CREATE TABLE IF NOT EXISTS public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT,
  destination_type TEXT NOT NULL CHECK (destination_type IN ('domestic', 'international')),
  destination_name TEXT NOT NULL,
  region_or_country TEXT NOT NULL,
  duration_nights INTEGER NOT NULL,
  duration_days INTEGER NOT NULL,
  starting_price_inr INTEGER NOT NULL,
  original_price_inr INTEGER,
  is_price_verified BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  badge TEXT,
  categories TEXT[] DEFAULT '{}',
  hero_image TEXT NOT NULL,
  gallery_images TEXT[] DEFAULT '{}',
  overview TEXT NOT NULL,
  best_time_to_visit TEXT,
  route TEXT NOT NULL,
  hotel_category TEXT NOT NULL,
  itinerary JSONB DEFAULT '[]'::jsonb,
  inclusions TEXT[] DEFAULT '{}',
  exclusions TEXT[] DEFAULT '{}',
  cancellation_policy TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. CUSTOMER ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.customer_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  trip_type TEXT NOT NULL,
  destination_preference TEXT NOT NULL,
  departure_city TEXT,
  travel_date_approx TEXT,
  adults_count INTEGER NOT NULL DEFAULT 1,
  children_count INTEGER DEFAULT 0,
  approx_budget_inr TEXT,
  additional_notes TEXT,
  origin_package_slug TEXT,
  origin_package_title TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'converted', 'archived')),
  internal_notes TEXT
);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_enquiries ENABLE ROW LEVEL SECURITY;

-- Public can read published packages and destinations
CREATE POLICY "Public can view published destinations"
  ON public.destinations FOR SELECT USING (true);

CREATE POLICY "Public can view published packages"
  ON public.packages FOR SELECT USING (status = 'published');

-- Public can submit customer enquiries
CREATE POLICY "Public can insert enquiries"
  ON public.customer_enquiries FOR INSERT WITH CHECK (true);

-- Authenticated staff can manage all data
CREATE POLICY "Staff can view all enquiries"
  ON public.customer_enquiries FOR ALL TO authenticated USING (true);

CREATE POLICY "Staff can manage all packages"
  ON public.packages FOR ALL TO authenticated USING (true);
