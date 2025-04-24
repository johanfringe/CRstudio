// src/admin-panel.js :
import React from "react";

const deleteUser = async (userId) => {
  try {
    const response = await fetch("/api/deleteUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Fout bij verwijderen gebruiker");
    }

    console.log("✅ Gebruiker succesvol verwijderd.");
  } catch (err) {
    console.error("❌ Fout bij verwijderen gebruiker", { err });
  }
};

// 🔹 Voeg een knop toe om een gebruiker te verwijderen
const AdminPanel = () => {
  return (
    <button onClick={() => deleteUser("550e8400-e29b-41d4-a716-446655440000")}>
      (klik) Verwijder Gebruiker
    </button>
  );
};

export default AdminPanel;
