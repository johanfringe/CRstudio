// src/utils/validateTurnstile.js
export const validateTurnstile = async (token) => {
    if (!token) {
        console.warn("⚠️ Turnstile: Geen token ontvangen!");
        return { success: false, message: "Turnstile token is missing" };
    }

    try {
        console.log("🔍 Turnstile validatie gestart...");

        const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                secret: process.env.TURNSTILE_SECRET,
                response: token,
            }),
        });

        const data = await response.json();
        console.log("✅ Turnstile validatierespons:", data);

        if (!data.success) {
            console.warn("❌ Turnstile verificatie mislukt!", data);
            return { success: false, message: "Turnstile verification failed" };
        }

        return { success: true };
    } catch (error) {
        console.error("❌ Turnstile API-fout:", error);
        return { success: false, message: "Turnstile validation error" };
    }
};
