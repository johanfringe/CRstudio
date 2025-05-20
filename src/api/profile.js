// src/api/profile.js :
import { createClient } from "@supabase/supabase-js";
import { validateSubdomain } from "../utils/validateSubdomain";
import { log, warn, error } from "../utils/logger";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ code: "METHOD_NOT_ALLOWED" });
  }

  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) {
    warn("🔒 Geen bearer token ontvangen bij profiel-aanmaak.");
    return res.status(401).json({ code: "TOKEN_MISSING" });
  }

  const client = createClient(process.env.GATSBY_SUPABASE_URL, token);
  const { firstName, lastName, subdomain, language } = req.body;

  const subError = validateSubdomain(subdomain);
  if (subError) {
    warn("⛔ Ongeldig subdomein via API", { subdomain });
    return res.status(400).json({ code: subError });
  }

  try {
    const { data: user, error: userError } = await client.auth.getUser();
    if (userError || !user?.user) {
      error("❌ Gebruiker ophalen mislukt", { userError });
      return res.status(401).json({ code: "INVALID_SESSION" });
    }

    const { id: user_id } = user.user;
    const normalizedSubdomain = subdomain.trim().toLowerCase();

    const { count, error: existingError } = await client
      .from("artists")
      .select("id", { count: "exact", head: true })
      .eq("subdomain", normalizedSubdomain);

    if (existingError) {
      error("❌ Fout bij subdomain-check", { existingError });
      return res.status(500).json({ code: "SUBDOMAIN_CHECK_FAILED" });
    }

    if (count > 0) {
      warn("⚠️ Subdomein al in gebruik", { normalizedSubdomain });
      return res.status(409).json({ code: "SUBDOMAIN_TAKEN" });
    }

    const { error: insertError } = await client.from("artists").insert([
      {
        user_id,
        first_name: firstName,
        last_name: lastName,
        subdomain: normalizedSubdomain,
        language,
      },
    ]);

    if (insertError) {
      error("❌ Insert mislukt", { insertError });
      return res.status(500).json({ code: "INSERT_FAILED" });
    }
    log("✅ Profiel toegevoegd voor", { user_id, normalizedSubdomain });
    return res.status(200).json({ code: "PROFILE_CREATED" });
  } catch (err) {
    error("🔥 Onverwachte API-fout (profile)", { err });
    return res.status(500).json({ code: "SERVER_ERROR", details: err.message });
  }
}
