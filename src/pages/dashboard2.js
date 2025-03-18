// src/dashboard2.js :
// Dit moet in de kunstenaarssite komen.
import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import LoginModal from "../components/LoginModal2"; // 🔹 Nieuw component voor modale login

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        setShowLogin(true); // 🚀 Toon login-modale venster als gebruiker niet is ingelogd
      } else {
        setUser(sessionData.session.user);
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold text-center">🏠 Welkom op je dashboard!</h1>

      {user ? (
        <div className="mt-6">
          <p className="text-lg text-gray-700 text-center">Wat wil je doen?</p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <button className="w-full p-3 bg-blue-500 text-white rounded-lg">📂 Gegevens beheren</button>
            <button className="w-full p-3 bg-green-500 text-white rounded-lg">🎨 Lay-out aanpassen</button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Laden...</p>
      )}

      {/* ✅ Modale login tonen als de gebruiker niet is ingelogd */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
};

export default Dashboard;
