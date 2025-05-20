// src/dashboard2.js :
// Dit moet in de kunstenaarssite komen.
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import LoginModal from "../components/LoginModal2";
import { useTranslation } from "gatsby-plugin-react-i18next";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const { t } = useTranslation();

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
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg">
      <h1 className="text-center text-3xl font-semibold">{t("dashboard.welcome")}</h1>

      {user ? (
        <div className="mt-6">
          <p className="text-center text-lg text-gray-700">{t("dashboard.what_do")}</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <button className="w-full rounded-lg bg-blue-500 p-3 text-white">
              {t("dashboard.manage_data")}
            </button>
            <button className="w-full rounded-lg bg-green-500 p-3 text-white">
              {t("dashboard.edit_layout")}
            </button>
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
