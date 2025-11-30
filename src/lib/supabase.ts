import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for future use
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          title: string
          description: string
          short_description: string
          price: number
          category: string
          available: boolean
          images: string[]
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          short_description: string
          price: number
          category: string
          available?: boolean
          images: string[]
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          short_description?: string
          price?: number
          category?: string
          available?: boolean
          images?: string[]
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string
          image: string
          product_count: number
        }
        Insert: {
          id?: string
          name: string
          description: string
          image: string
          product_count?: number
        }
        Update: {
          id?: string
          name?: string
          description?: string
          image?: string
          product_count?: number
        }
      }
    }
  }
}
