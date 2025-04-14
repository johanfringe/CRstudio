// src/api/profile.js :
import { createClient } from "@supabase/supabase-js";
import { validateSubdomain } from "@/utils/validateSubdomain";

const supabase = createClient(
  process.env.GATSBY_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
    return res.status(401).json({ message: "Missing Supabase session token" });
  }

  const client = createClient(
    process.env.GATSBY_SUPABASE_URL,
    token
  );

  const { firstName, lastName, subdomain, language } = req.body;

  // ✅ Server-side subdomeinvalidatie (regex + blocklist)
  const subError = validateSubdomain(subdomain);
  if (subError) {
    console.warn("⛔ Ongeldig subdomein via API:", subdomain);
    return res.status(400).json({ code: subError });
  }

  try {
    const { data: user, error: userError } = await client.auth.getUser();

    if (userError || !user?.user) {
      console.error("❌ Kon gebruiker niet ophalen:", userError);
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id: user_id } = user.user;

    const { count, error: existingError } = await client
      .from("artists")
      .select("id", { count: "exact", head: true })
      .eq("subdomain", subdomain);

    if (existingError) {
      console.error("❌ Fout bij subdomain-check:", existingError);
      return res.status(500).json({ message: "Interne fout bij subdomain-check" });
    }

    if (count > 0) {
      return res.status(409).json({ code: "SUBDOMAIN_TAKEN" });
    }

    const { error } = await client.from("artists").insert([
      {
        user_id,
        first_name: firstName,
        last_name: lastName,
        subdomain: normalizedSubdomain,
        language
      }
    ]);

    if (error) {
      console.error("❌ Supabase insert fout:", error.message);
      return res.status(500).json({ message: error.message });
    }

    return res.status(200).json({ message: "Artist aangemaakt" });

  } catch (err) {
    console.error("🔥 Interne fout:", err);
    return res.status(500).json({ message: "Interne serverfout" });
  }
}
