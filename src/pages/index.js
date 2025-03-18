// src/pages/index.js :
import React from "react";
import { graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import Seo from "../components/Seo";
import StickyHeader from "../components/StickyHeader";
import Footer from "../components/Footer";
import OverviewSection from "../components/HomeOverviewSection";
import HighlightSection from "../components/HomeHighlightSection";
import FeatureSection from "../components/HomeFeatureSection";
import PricingSection from "../components/HomePricingSection";
import FAQSection from "../components/HomeFAQSection";
import TestiSection from "../components/HomeTestiSection";

const IndexPage = () => {
  console.log("Rendering [componentnaam]", Date.now());  // 🚀 Debugging
  
  const { t } = useTranslation();

  const sections = [
    { id: "overview", label: t("header.overview") },
    { id: "feature", label: t("header.feature") },
    { id: "pricing", label: t("header.pricing") },
    { id: "faq", label: t("header.faq") },
  ];

  return (
    <>
      <Seo />
      <StickyHeader sections={sections} />
      <div className="flex flex-col min-h-screen relative">
        <main className="flex-grow space-y-0 relative z-10">
          <section id="overview">
            <OverviewSection />
          </section>
          <section className="">
            <HighlightSection />
          </section>
          <section id="feature">
            <FeatureSection />
          </section>
          <section id="pricing">
            <PricingSection />
          </section>
          <section id="faq">
            <FAQSection />
          </section>
          {/* ✅ Extra sectie buiten de StickyHeader */}
          <section className="">
            <TestiSection />
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default IndexPage;

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
