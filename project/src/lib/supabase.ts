import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';
const supabaseEnabled = import.meta.env.VITE_SUPABASE_ENABLED === 'true';

// Create a chainable mock query builder
const createMockQueryBuilder = () => {
  const mockResult = { data: [], error: null };
  
  const queryBuilder = {
    select: () => queryBuilder,
    insert: () => queryBuilder,
    update: () => queryBuilder,
    delete: () => queryBuilder,
    upsert: () => queryBuilder,
    eq: () => queryBuilder,
    neq: () => queryBuilder,
    gt: () => queryBuilder,
    gte: () => queryBuilder,
    lt: () => queryBuilder,
    lte: () => queryBuilder,
    like: () => queryBuilder,
    ilike: () => queryBuilder,
    is: () => queryBuilder,
    in: () => queryBuilder,
    contains: () => queryBuilder,
    containedBy: () => queryBuilder,
    rangeGt: () => queryBuilder,
    rangeGte: () => queryBuilder,
    rangeLt: () => queryBuilder,
    rangeLte: () => queryBuilder,
    rangeAdjacent: () => queryBuilder,
    overlaps: () => queryBuilder,
    textSearch: () => queryBuilder,
    match: () => queryBuilder,
    not: () => queryBuilder,
    or: () => queryBuilder,
    filter: () => queryBuilder,
    order: () => queryBuilder,
    limit: () => queryBuilder,
    range: () => queryBuilder,
    single: () => queryBuilder,
    maybeSingle: () => queryBuilder,
    csv: () => queryBuilder,
    geojson: () => queryBuilder,
    explain: () => queryBuilder,
    rollback: () => queryBuilder,
    returns: () => queryBuilder,
    then: (resolve: (value: any) => void) => {
      resolve(mockResult);
      return Promise.resolve(mockResult);
    },
    catch: () => Promise.resolve(mockResult),
    finally: () => Promise.resolve(mockResult)
  };
  
  return queryBuilder;
};

// Create a mock client for development when Supabase is not configured
const createMockClient = () => ({
  from: () => createMockQueryBuilder(),
  auth: {
    signUp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
});

// Use real Supabase client if enabled and configured, otherwise use mock
export const supabase = supabaseEnabled && 
  supabaseUrl !== 'https://your-project.supabase.co' && 
  supabaseAnonKey !== 'your-anon-key'
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

export const isSupabaseConfigured = supabaseEnabled && 
  supabaseUrl !== 'https://your-project.supabase.co' && 
  supabaseAnonKey !== 'your-anon-key';

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          sale_price: number | null;
          category_id: string;
          image_url: string;
          images: string[] | null;
          stock_quantity: number;
          is_featured: boolean;
          rating: number | null;
          review_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          sale_price?: number | null;
          category_id: string;
          image_url: string;
          images?: string[] | null;
          stock_quantity?: number;
          is_featured?: boolean;
          rating?: number | null;
          review_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          sale_price?: number | null;
          category_id?: string;
          image_url?: string;
          images?: string[] | null;
          stock_quantity?: number;
          is_featured?: boolean;
          rating?: number | null;
          review_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          user_id?: string;
          rating?: number;
          comment?: string | null;
          created_at?: string;
        };
      };
      wishlists: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          created_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string | null;
          session_id: string | null;
          product_id: string;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          session_id?: string | null;
          product_id: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          session_id?: string | null;
          product_id?: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};