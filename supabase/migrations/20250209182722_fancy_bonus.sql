/*
  # Market Prices and Alerts Schema

  1. New Tables
    - market_prices
      - Stores real-time price data for agricultural commodities
      - Includes current prices, historical data, and market indicators
    - price_alerts
      - Stores user-configured price alerts
      - Tracks alert conditions and notification status
    - market_locations
      - Stores information about market locations
      - Includes geographical and operational details

  2. Security
    - Enable RLS on all tables
    - Public read access for market prices
    - User-specific access for price alerts
*/

-- Market Locations
CREATE TABLE IF NOT EXISTS market_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  location point NOT NULL,
  operating_hours jsonb,
  contact_info jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Market Prices
CREATE TABLE IF NOT EXISTS market_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commodity text NOT NULL,
  market_id uuid REFERENCES market_locations(id),
  current_price decimal(10,2) NOT NULL,
  previous_price decimal(10,2) NOT NULL,
  day_high decimal(10,2) NOT NULL,
  day_low decimal(10,2) NOT NULL,
  volume integer NOT NULL DEFAULT 0,
  quality_grades jsonb NOT NULL DEFAULT '[]',
  market_demand text CHECK (market_demand IN ('low', 'medium', 'high')),
  weather_impact jsonb,
  transport_costs jsonb,
  timestamp timestamptz DEFAULT now()
);

-- Price History
CREATE TABLE IF NOT EXISTS price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  market_price_id uuid REFERENCES market_prices(id),
  price decimal(10,2) NOT NULL,
  timestamp timestamptz DEFAULT now()
);

-- Price Alerts
CREATE TABLE IF NOT EXISTS price_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  commodity text NOT NULL,
  condition text NOT NULL CHECK (condition IN ('above', 'below')),
  price decimal(10,2) NOT NULL,
  active boolean DEFAULT true,
  last_triggered_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE market_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Market Locations
CREATE POLICY "Market locations are viewable by everyone"
  ON market_locations FOR SELECT
  USING (true);

-- Market Prices
CREATE POLICY "Market prices are viewable by everyone"
  ON market_prices FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify market prices"
  ON market_prices FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Price History
CREATE POLICY "Price history is viewable by everyone"
  ON price_history FOR SELECT
  USING (true);

-- Price Alerts
CREATE POLICY "Users can view their own alerts"
  ON price_alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own alerts"
  ON price_alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts"
  ON price_alerts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alerts"
  ON price_alerts FOR DELETE
  USING (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION update_price_history()
RETURNS trigger AS $$
BEGIN
  INSERT INTO price_history (market_price_id, price)
  VALUES (NEW.id, NEW.current_price);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE TRIGGER on_price_update
  AFTER INSERT OR UPDATE OF current_price ON market_prices
  FOR EACH ROW
  EXECUTE FUNCTION update_price_history();