// Extending existing Database interface
export interface Database {
  public: {
    Tables: {
      // ... (existing tables remain unchanged)
      
      delivery_partners: {
        Row: {
          id: string
          user_id: string
          business_name: string
          contact_person: string
          email: string
          phone: string
          vehicle_type: string
          vehicle_capacity: number
          temperature_controlled: boolean
          service_area: Json // Array of postal codes or regions
          active_status: boolean
          current_location: Json // { lat: number, lng: number }
          verification_status: 'pending' | 'verified' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          contact_person: string
          email: string
          phone: string
          vehicle_type: string
          vehicle_capacity: number
          temperature_controlled: boolean
          service_area: Json
          active_status?: boolean
          current_location?: Json
          verification_status?: 'pending' | 'verified' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          contact_person?: string
          email?: string
          phone?: string
          vehicle_type?: string
          vehicle_capacity?: number
          temperature_controlled?: boolean
          service_area?: Json
          active_status?: boolean
          current_location?: Json
          verification_status?: 'pending' | 'verified' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      delivery_orders: {
        Row: {
          id: string
          order_id: string
          delivery_partner_id: string
          pickup_location: Json
          delivery_location: Json
          status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'failed'
          scheduled_pickup: string
          scheduled_delivery: string
          actual_pickup: string | null
          actual_delivery: string | null
          temperature_log: Json[] // Array of { timestamp: string, temperature: number }
          tracking_updates: Json[] // Array of { timestamp: string, status: string, location: Json }
          proof_of_delivery: string | null
          delivery_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          delivery_partner_id: string
          pickup_location: Json
          delivery_location: Json
          status?: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'failed'
          scheduled_pickup: string
          scheduled_delivery: string
          actual_pickup?: string | null
          actual_delivery?: string | null
          temperature_log?: Json[]
          tracking_updates?: Json[]
          proof_of_delivery?: string | null
          delivery_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          delivery_partner_id?: string
          pickup_location?: Json
          delivery_location?: Json
          status?: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'failed'
          scheduled_pickup?: string
          scheduled_delivery?: string
          actual_pickup?: string | null
          actual_delivery?: string | null
          temperature_log?: Json[]
          tracking_updates?: Json[]
          proof_of_delivery?: string | null
          delivery_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      delivery_pricing: {
        Row: {
          id: string
          base_rate: number
          distance_rate: number
          weight_rate: number
          urgent_multiplier: number
          temperature_controlled_rate: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          base_rate: number
          distance_rate: number
          weight_rate: number
          urgent_multiplier: number
          temperature_controlled_rate: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          base_rate?: number
          distance_rate?: number
          weight_rate?: number
          urgent_multiplier?: number
          temperature_controlled_rate?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}