// src/pages/verify-email.js :
import React, { useState, useEffect } from "react";

const VerifyEmail = () => {
  const [status, setStatus] = useState("Verifying...");
  const [resendLoading, setResendLoading] = useState(false);

  // ✅ Correcte manier om de `token` uit de URL te halen in Gatsby
  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      fetch("/api/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => setStatus(data.message))
        .catch(() => setStatus("Verification failed. Try again."));
    }
  }, [token]);

  const handleResend = async () => {
    setResendLoading(true);
    await fetch("/api/resendVerificationEmail", { method: "POST" });
    setResendLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-gray-800">Email Verification</h1>
        <p className="text-gray-600 mt-2">{status}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
          disabled={resendLoading}
          onClick={handleResend}
        >
          {resendLoading ? "Versturen..." : "Verstuur opnieuw"}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
