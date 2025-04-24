// src/utils/session.js
import { supabase } from "../lib/supabaseClient";
import { warn } from "./logger";

export const waitForSession = async (retries = 5, delay = 300, logId = "") => {
    for (let i = 0; i < retries; i++) {
      const { data, error } = await supabase.auth.getSession();
  
      // Sessie gevonden = OK
      if (data?.session) {
        log("✅ Sessie gevonden", { logId, attempt: i + 1 });
        return data.session;
      }
  
    // Echte fout (bv. netwerk) = log + stop retries
      if (error) {
        warn("❗ getSession() fout tijdens retry", { logId, attempt: i + 1, error });
        break;
      }
  
    // Geen sessie maar ook geen fout = wacht even
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

  // Geen sessie na alle pogingen
    warn("❗ Geen sessie gevonden", { retries });
    return null;
  };
  