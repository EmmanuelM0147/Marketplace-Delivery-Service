/*
  # Buyer Account System Schema

  1. New Tables
    - `user_security_logs`
      - Track login attempts and security events
    - `user_sessions`
      - Manage active sessions and devices
    - `user_audit_logs`
      - Track user data changes
    
  2. Security
    - Enable RLS on all tables
    - Add policies for data access control
    - Audit logging for security events
*/

-- User Security Logs
CREATE TABLE IF NOT EXISTS user_security_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  ip_address text,
  user_agent text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- User Sessions
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id text NOT NULL,
  device_type text,
  last_active timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Audit Logs
CREATE TABLE IF NOT EXISTS user_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Security Logs
CREATE POLICY "Users can view their own security logs"
  ON user_security_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Sessions
CREATE POLICY "Users can view and manage their sessions"
  ON user_sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Audit Logs
CREATE POLICY "Users can view their own audit logs"
  ON user_audit_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION log_security_event()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_security_logs (
    user_id,
    event_type,
    ip_address,
    user_agent,
    metadata
  )
  VALUES (
    NEW.id,
    TG_ARGV[0],
    current_setting('request.headers')::json->>'x-forwarded-for',
    current_setting('request.headers')::json->>'user-agent',
    jsonb_build_object(
      'provider', NEW.raw_app_meta_data->>'provider',
      'method', NEW.raw_app_meta_data->>'method'
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE TRIGGER on_auth_user_login
  AFTER INSERT ON auth.sessions
  FOR EACH ROW
  EXECUTE FUNCTION log_security_event('login');

CREATE TRIGGER on_auth_user_logout
  AFTER DELETE ON auth.sessions
  FOR EACH ROW
  EXECUTE FUNCTION log_security_event('logout');