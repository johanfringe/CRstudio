// src/api/cleanupUsers.js :
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
    console.log("[CLEANUP JOB] 🔄 CleanupUsers: Start: Verwijderen van verlopen temp_users...");

    const GATSBY_SUPABASE_URL = process.env.GATSBY_SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!GATSBY_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("[CLEANUP JOB] ❌ ERROR: Missing Supabase credentials!");
      return res.status(500).json({ error: "Server misconfiguration" });
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(GATSBY_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const thresholdTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    console.log(`[CLEANUP JOB] 🕒 Gebruikers aangemaakt voor: ${thresholdTime} worden verwijderd`);

    // ✅ Zorg ervoor dat count altijd wordt teruggegeven
    const { error, count, data } = await supabase
      .from("temp_users")
      .delete()
      .lt("created_at", thresholdTime)
      .select("id", { count: "exact" });

    if (error) {
      console.error("[CLEANUP JOB] ❌ Database cleanup error:", JSON.stringify(error, null, 2));
      return res.status(500).json({
        error: "Database cleanup failed",
        details: error.message,
      });
    }

    // ✅ Controleer of count correct is, anders gebruik data.length
    const deletedCount = count ?? (Array.isArray(data) ? data.length : 0);

    console.log(`[CLEANUP JOB] ✅ SUCCESS: ${deletedCount} temp_users verwijderd`);

    if (deletedCount === 0) {
      console.warn("[CLEANUP JOB] ⚠️ Geen gebruikers gevonden om te verwijderen.");
    }

    return res.status(200).json({
      message: `${deletedCount} temp_users verwijderd`,
      deletedUsers: data || [],
    });

  } catch (err) {
    console.error(`[CLEANUP JOB] ❌ ERROR:`, JSON.stringify(err, null, 2));
    return res.status(500).json({
      error: "Server error tijdens cleanup",
      details: err.stack || err.message,
    });
  }
}
