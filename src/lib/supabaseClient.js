// src/lib/supabaseClient.js :
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.GATSBY_SUPABASE_URL;
const supabaseKey = process.env.GATSBY_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    flowType: "pkce",
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
  },
});
