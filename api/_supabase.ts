/*
  Public Supabase settings for the server functions. These are the same
  values as .env.production, which the site already ships to every browser:
  the publishable key is meant to be public, and row level security
  (supabase/open-call.sql) protects the data. Vercel settings win if set.
*/
export const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "https://jcmisqjrbxnrqwcykpkj.supabase.co";
export const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_qtMvJ34s_OUanTUGlPAAQQ_C-l6_nXd";
