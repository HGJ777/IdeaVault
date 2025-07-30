// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Debug logging
console.log('Environment check:')
console.log('URL:', supabaseUrl)
console.log('Key exists:', !!supabaseAnonKey)
console.log('Key length:', supabaseAnonKey?.length)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
          is_premium: boolean
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          is_premium?: boolean
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          is_premium?: boolean
        }
      }
      ideas: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          title: string
          description: string
          category: string
          tags: string[]
          price: number | null
          is_private: boolean
          allow_licensing: boolean
          user_id: string
          views: number
          likes: number
          status: 'draft' | 'active' | 'sold'
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string | null
          title: string
          description: string
          category: string
          tags?: string[]
          price?: number | null
          is_private?: boolean
          allow_licensing?: boolean
          user_id: string
          views?: number
          likes?: number
          status?: 'draft' | 'active' | 'sold'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          title?: string
          description?: string
          category?: string
          tags?: string[]
          price?: number | null
          is_private?: boolean
          allow_licensing?: boolean
          user_id?: string
          views?: number
          likes?: number
          status?: 'draft' | 'active' | 'sold'
        }
      }
    }
  }
}