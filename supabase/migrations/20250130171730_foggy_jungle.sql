/*
  # Farmer Marketplace Schema

  1. New Tables
    - `farmer_profiles`
      - Extended profile for farmers with farm details
      - Links to auth.users
    - `buyer_profiles`
      - Extended profile for buyers
      - Links to auth.users
    - `farm_certifications`
      - Stores certification details for farmers
    - `product_reviews`
      - Customer reviews and ratings
    - `orders`
      - Order management and tracking
    - `order_items`
      - Individual items in orders
    - `delivery_preferences`
      - User delivery settings

  2. Security
    - Enable RLS on all tables
    - Add policies for data access control
    - Secure sensitive information

  3. Changes
    - Add new user roles for farmers and buyers
    - Create relationships between tables
*/

-- Add new user roles
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'farmer';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'buyer';

-- Create farmer profiles table
CREATE TABLE IF NOT EXISTS farmer_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  farm_name text NOT NULL,
  farm_description text,
  farm_location jsonb NOT NULL,
  farm_size numeric,
  farm_size_unit text,
  farming_type text[],
  years_farming integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create buyer profiles table
CREATE TABLE IF NOT EXISTS buyer_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name text,
  business_type text,
  preferred_payment_methods text[],
  purchase_frequency text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create farm certifications table
CREATE TABLE IF NOT EXISTS farm_certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid REFERENCES farmer_profiles(id) ON DELETE CASCADE,
  certification_name text NOT NULL,
  issuing_body text NOT NULL,
  issue_date date NOT NULL,
  expiry_date date,
  certificate_url text,
  verification_status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create product reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  review_images text[],
  verified_purchase boolean DEFAULT false,
  helpful_votes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending',
  total_amount decimal(10,2) NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending',
  payment_method text,
  delivery_method text NOT NULL,
  delivery_address jsonb,
  delivery_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  quantity integer NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create delivery preferences table
CREATE TABLE IF NOT EXISTS delivery_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  state text NOT NULL,
  postal_code text NOT NULL,
  country text NOT NULL DEFAULT 'Nigeria',
  is_default boolean DEFAULT false,
  delivery_instructions text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Farmer Profiles
CREATE POLICY "Farmers can view their own profile"
  ON farmer_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Farmers can update their own profile"
  ON farmer_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Buyer Profiles
CREATE POLICY "Buyers can view their own profile"
  ON buyer_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Buyers can update their own profile"
  ON buyer_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Farm Certifications
CREATE POLICY "Public can view verified certifications"
  ON farm_certifications FOR SELECT
  USING (verification_status = 'verified');

CREATE POLICY "Farmers can manage their certifications"
  ON farm_certifications FOR ALL
  USING (auth.uid() = farmer_id)
  WITH CHECK (auth.uid() = farmer_id);

-- Product Reviews
CREATE POLICY "Public can view reviews"
  ON product_reviews FOR SELECT
  USING (true);

CREATE POLICY "Verified buyers can create reviews"
  ON product_reviews FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE o.buyer_id = auth.uid()
      AND oi.product_id = product_reviews.product_id
      AND o.status = 'delivered'
    )
  );

-- Orders
CREATE POLICY "Buyers can view their orders"
  ON orders FOR SELECT
  USING (auth.uid() = buyer_id);

CREATE POLICY "Buyers can create orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

-- Order Items
CREATE POLICY "Users can view their order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.buyer_id = auth.uid()
    )
  );

-- Delivery Preferences
CREATE POLICY "Users can manage their delivery preferences"
  ON delivery_preferences FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);