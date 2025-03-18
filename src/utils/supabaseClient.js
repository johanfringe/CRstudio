// src/utils/supabaseClient.js :
import { createClient } from "@supabase/supabase-js";

const GATSBY_SUPABASE_URL = process.env.GATSBY_SUPABASE_URL;
const GATSBY_SUPABASE_ANON_KEY = process.env.GATSBY_SUPABASE_ANON_KEY;

export const supabase = createClient(GATSBY_SUPABASE_URL, GATSBY_SUPABASE_ANON_KEY);
