// src/utils/sendEmail.js :
import fetch from "node-fetch";
import { log, error, captureApiError } from "./logger";

/**
 * 📧 Herbruikbare e-mailfunctie met Postmark
 * @param {string} to - Ontvanger van de e-mail
 * @param {string} subject - Onderwerp van de e-mail
 * @param {string} textBody - Tekstuele inhoud van de e-mail
 * @param {string} htmlBody - HTML-inhoud van de e-mail (optioneel)
 */
export const sendEmail = async (to, subject, textBody, htmlBody = "") => {
  if (!process.env.POSTMARK_API_KEY) {
    return { success: false, error: "API sleutel ontbreekt" };
  }

  try {
    log("📩 Verzenden van e-mail naar", { to, subject });
    log("📨 API-call naar Postmark wordt verstuurd", {
      endpoint: "https://api.postmarkapp.com/email",
      to,
      subject,
    });

    const response = await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": process.env.POSTMARK_API_KEY,
      },
      body: JSON.stringify({
        From: "info@crstudio.online",
        To: to,
        Subject: subject,
        TextBody: textBody,
        HtmlBody: htmlBody,
      }),
    });

    if (!response.ok) {
      const responseText = await response.text();
      captureApiError("/email (Postmark)", response, {
        to,
        subject,
        responseText,
        errorCode: "EMAIL_SEND_FAILED",
      });
      return { success: false, error: responseText };
    }

    log("✅ E-mail succesvol verzonden", { to, subject });
    return { success: true };
  } catch (err) {
    error("❌ Fout bij verzenden e-mail via Postmark", { to, subject, err });
    return { success: false, error: err.message };
  }
};
