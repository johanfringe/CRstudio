// /components/HomePricingSection.js :
import React, { useState } from "react";
import { useTranslation } from "gatsby-plugin-react-i18next";
import SectionWrapper from "../components/SectionWrapper";

// 📌 Prijzen voor verschillende drempels
const pricingTiers = [
  { artworks: 1000, monthly: 100, annual: 85 },
  { artworks: 1250, monthly: 125, annual: 106 },
  { artworks: 1500, monthly: 150, annual: 128 },
  { artworks: 2500, monthly: 200, annual: 170 },
  { artworks: 4000, monthly: 250, annual: 213 },
];

const PricingSection = () => {
  const { t } = useTranslation();
  const [artworkCount, setArtworkCount] = useState(1000);
  const [billingPeriod, setBillingPeriod] = useState("monthly");

  // ✅ Bepaal de actieve prijs op basis van de schuifwaarde
  const activePlan = pricingTiers.find((tier) => artworkCount <= tier.artworks) || pricingTiers[pricingTiers.length - 1];

  // ✅ Inline SVG Component (Modern Blauw Vinkje)
  const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-500 mr-2">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );

  // ✅ Dynamische e-mailonderwerpregel vertalen
  const emailSubject = encodeURIComponent(t("pricing.email_subject"));
  const emailBody = encodeURIComponent(t("pricing.email_body"));

  return (
    <SectionWrapper bgColor="bg-white">
      {/* ✅ Titel en subtitel */}
      <div className="text-center mb-20 mt-10">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 mb-4">{t("pricing.title")}</h1>
        <p className="text-lg text-gray-500">{t("pricing.subtitle")}</p>
      </div>

      {/* ✅ Schuifbalk en Toggle */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold">
        {t("pricing.up_to")} <span className="text-rose-400 font-bold">{artworkCount.toLocaleString()}</span> {t("pricing.artworks")}
        </h2>
        
        {/* Slider */}
        <input
          type="range"
          min="1000"
          max="4000"
          step="250"
          value={artworkCount}
          onChange={(e) => setArtworkCount(Number(e.target.value))}
          className="w-full max-w-xl mt-4 appearance-none h-1 bg-gray-300 rounded-full outline-none"
        />


        {/* Toggle Switch Maandelijkse / Jaarlijkse betaling */}
        <div className="flex justify-center items-center gap-4 mt-4">
          <span className={billingPeriod === "monthly" ? "font-regular" : "text-gray-500"}>{t("pricing.monthly")}</span>
          <label htmlFor="billing-toggle" className="relative inline-flex items-center cursor-pointer">
          <span className="sr-only">{t("pricing.toggle_billing")}</span>
            <input
              id="billing-toggle"
              type="checkbox"
              className="sr-only peer"
              checked={billingPeriod === "annual"}
              onChange={() => setBillingPeriod(billingPeriod === "monthly" ? "annual" : "monthly")}
            />
          <div className="w-11 h-6 ring-2 ring-gray-300 rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-1 after:left-1 after:bg-black after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
          </label>
          <span className={billingPeriod === "annual" ? "font-regular" : "text-gray-500"}>{t("pricing.annually")}</span>
        </div>
      </div>

      {/* ✅ Prijzentabel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 📌 Kolom 1: Basis Plan (tot 1000 kunstwerken) */}
        <div className={`bg-white p-6 rounded-lg shadow border-2 transition-transform duration-500 ${artworkCount > 1000 ? "scale-95 opacity-30" : "scale-100 opacity-100"}`}>
          <h3 className="text-lg font-bold mb-2">
          {t("pricing.up_to_free")} <span className="text-black font-bold">{Math.min(artworkCount, 1000).toLocaleString()}</span> {t("pricing.artworks")}
          </h3>
          <p className="text-3xl font-bold">
          €0 <span className="text-gray-600 text-sm">{t("pricing.month")}</span>
          </p>
          <p className="text-sm text-gray-500">&nbsp;</p>
          <a href="/register" className="btn btn-primary w-full text-center flex justify-center items-center mt-4">{t("pricing.try_free")}</a>
          <ul className="mt-4 text-sm text-gray-900 space-y-2">
            <li className="flex items-start gap-1">
              <CheckIcon /> {t("pricing.button_10")}
            </li>
            <li className="flex items-start gap-1">
              <CheckIcon /> {t("pricing.button_11")}
            </li>
            <li className="flex items-start gap-1">
              <CheckIcon /> {t("pricing.button_12")}
            </li>
            <li className="flex items-start gap-1">
              <CheckIcon /> {t("pricing.button_13")}
            </li>
          </ul>
        </div>

        {/* 📌 Kolom 2: Dynamische Prijzen voor 1250 - 4000 kunstwerken */}
        <div className="bg-white p-6 rounded-lg shadow border-2">
          <h3 className="text-lg font-bold mb-2">
          {t("pricing.up_to")} <span className="text-black font-bold">{artworkCount.toLocaleString()}</span> {t("pricing.artworks")}
          </h3>
          <p className="text-3xl font-bold">
            €{billingPeriod === "monthly" ? activePlan.monthly : activePlan.annual} <span className="text-gray-600 text-sm">{t("pricing.month")}</span>
          </p>
          <p className="text-sm text-gray-500">{billingPeriod === "monthly" ? t("pricing.billed_monthly") : t("pricing.billed_annually")}</p>
          <a href="/register" className="btn btn-primary w-full text-center flex justify-center items-center mt-4">{t("pricing.buy_now")}</a>
          {/* 📌 Extra melding bij > 4000 kunstwerken */}
          {artworkCount >= 4000 && (
            <p className="mt-4 text-gray-700 font-semibold text-center">
              {t("pricing.more_than_4000")}
            <button className="btn btn-primary w-full mt-4">{t("pricing.contact_us")}</button>
            </p>
          )}
          <ul className="mt-4 text-sm text-gray-900 space-y-2">
            <li className="flex items-start gap-1">
              <CheckIcon /> {t("pricing.button_20")}
            </li>
            <li className="flex items-start gap-1">
              <CheckIcon /> {t("pricing.button_21")}
            </li>
          </ul>
        </div>

        {/* 📌 Kolom 3: Business Plan (ongewijzigd) */}
        <div className="bg-white p-6 rounded-lg shadow border-2">
          <h3 className="text-xl font-bold mb-2">{t("pricing.other_services")}</h3>
          <p className="text-lg font-bold">{t("pricing.offering")}</p>
          <a href={`mailto:sales@crstudio.online?subject=${emailSubject}&body=${emailBody}`} 
              className="btn btn-primary w-full text-center flex justify-center items-center mt-4">{t("pricing.contact_us")}</a>
          <ul className="mt-4 text-sm text-gray-900 space-y-2">
            <li className="flex items-start gap-1">
              <CheckIcon /> {t("pricing.button_30")}
            </li>
            <li className="flex items-start gap-1">
              <CheckIcon /> {t("pricing.button_31")}
            </li>
            <li className="flex items-start gap-1">
              <CheckIcon /> {t("pricing.button_32")}
            </li>
            <li className="flex items-start gap-1">
              <CheckIcon /> {t("pricing.button_33")}
            </li>
          </ul>
        </div>
      </div>
      <p className="text-center text-sm font-regular mt-4 mb-10">{t("pricing.taxes")}</p>
    </SectionWrapper>
  );
};

export default PricingSection;
