// src/components/PasswordStrengthMeter.js
import React from "react";
import { useTranslation } from "gatsby-plugin-react-i18next";

const strengthLevels = [
  { labelKey: "auth.strength_very_weak", color: "bg-red-500" },
  { labelKey: "auth.strength_weak", color: "bg-orange-500" },
  { labelKey: "auth.strength_fair", color: "bg-yellow-500" },
  { labelKey: "auth.strength_good", color: "bg-green-400" },
  { labelKey: "auth.strength_strong", color: "bg-green-600" },
];

const PasswordStrengthMeter = ({ score }) => {
  const { t } = useTranslation();
  const level = strengthLevels[score] || strengthLevels[0];

  return (
    <div className="mt-2">
      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${level.color}`}
          style={{ width: `${(score + 1) * 20}%` }}
        ></div>
      </div>
      <p className="text-xs mt-1 text-gray-700">{t(level.labelKey)}</p>
    </div>
  );
};

export default PasswordStrengthMeter;
