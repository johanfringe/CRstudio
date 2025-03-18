// src/utils/sendEmail.js :
import fetch from "node-fetch";

/**
 * 📧 Herbruikbare e-mailfunctie met Postmark
 * @param {string} to - Ontvanger van de e-mail
 * @param {string} subject - Onderwerp van de e-mail
 * @param {string} textBody - Tekstuele inhoud van de e-mail
 * @param {string} htmlBody - HTML-inhoud van de e-mail (optioneel)
 */
export const sendEmail = async (to, subject, textBody, htmlBody = "") => {
  try {
    console.log(`📩 Verzenden van e-mail naar: ${to}`);

    const response = await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": process.env.POSTMARK_API_KEY
      },
      body: JSON.stringify({
        From: "info@crstudio.online",
        To: to,
        Subject: subject,
        TextBody: textBody,
        HtmlBody: htmlBody
      })
    });

    if (!response.ok) {
      throw new Error(`Postmark fout: ${response.statusText}`);
    }

    console.log("✅ E-mail succesvol verzonden naar:", to);
    return { success: true };
  } catch (error) {
    console.error("❌ Fout bij verzenden e-mail:", error);
    return { success: false, error: error.message };
  }
};
