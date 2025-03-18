// src/LoginModal2.js :
// dit is de login van /pages/dashoard2. Kijk naar /pages/login voor uitgebreide versie
// Dit moeten in de kunstenaaarsite komen
import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";

const LoginModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      window.location.reload(); // 🚀 Herlaad de pagina om het dashboard te tonen na login
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center">🔒 Login</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="E-mailadres"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Wachtwoord"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Inloggen
          </button>
        </form>
        <button onClick={onClose} className="mt-3 text-sm text-gray-500 w-full text-center">
          Annuleren
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
