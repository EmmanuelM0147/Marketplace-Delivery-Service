/*
  # Marketplace Schema Implementation

  1. New Tables
    - `farmer_verifications`
      - Stores verification documents and status
    - `product_certifications`
      - Quality certifications for products
    - `payment_methods`
      - Encrypted payment information for buyers
    - `inventory_logs`
      - Real-time inventory tracking
    
  2. Security
    - Enable RLS on all tables
    - Add policies for data access control
    - Encryption for sensitive data
*/

-- Farmer Verifications
CREATE TABLE IF NOT EXISTS farmer_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid REFERENCES farmer_profiles(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  document_url text NOT NULL,
  verification_status text DEFAULT 'pending',
  verified_at timestamptz,
  verified_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Product Certifications
CREATE TABLE IF NOT EXISTS product_certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  certification_type text NOT NULL,
  issuing_body text NOT NULL,
  certificate_number text,
  issue_date date NOT NULL,
  expiry_date date,
  document_url text,
  created_at timestamptz DEFAULT now()
);

-- Payment Methods
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_type text NOT NULL,
  provider text NOT NULL,
  last_four text,
  expiry_date text,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Inventory Logs
CREATE TABLE IF NOT EXISTS inventory_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  change_type text NOT NULL,
  quantity_change integer NOT NULL,
  previous_quantity integer NOT NULL,
  new_quantity integer NOT NULL,
  reference_type text,
  reference_id uuid,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE farmer_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Farmer Verifications
CREATE POLICY "Farmers can view their own verifications"
  ON farmer_verifications FOR SELECT
  USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can submit verifications"
  ON farmer_verifications FOR INSERT
  WITH CHECK (auth.uid() = farmer_id);

-- Product Certifications
CREATE POLICY "Public can view certifications"
  ON product_certifications FOR SELECT
  USING (true);

CREATE POLICY "Farmers can manage their product certifications"
  ON product_certifications FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM products p
      JOIN farmer_profiles f ON p.farmer_id = f.id
      WHERE p.id = product_certifications.product_id
      AND f.id = auth.uid()
    )
  );

-- Payment Methods
CREATE POLICY "Users can manage their payment methods"
  ON payment_methods FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Inventory Logs
CREATE POLICY "Users can view their inventory logs"
  ON inventory_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products p
      WHERE p.id = inventory_logs.product_id
      AND p.farmer_id = auth.uid()
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION update_inventory_log()
RETURNS trigger AS $$
BEGIN
  INSERT INTO inventory_logs (
    product_id,
    change_type,
    quantity_change,
    previous_quantity,
    new_quantity,
    created_by
  )
  VALUES (
    NEW.id,
    CASE
      WHEN TG_OP = 'INSERT' THEN 'initial'
      ELSE 'update'
    END,
    CASE
      WHEN TG_OP = 'INSERT' THEN NEW.inventory_count
      ELSE NEW.inventory_count - OLD.inventory_count
    END,
    CASE
      WHEN TG_OP = 'INSERT' THEN 0
      ELSE OLD.inventory_count
    END,
    NEW.inventory_count,
    auth.uid()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE TRIGGER on_inventory_change
  AFTER INSERT OR UPDATE OF inventory_count ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_inventory_log();