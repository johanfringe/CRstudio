// src/pages/en/privacy.js
import React from "react";
import { graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import Seo from "../components/Seo";
import SectionWrapper from "../components/SectionWrapper";

const PrivacyPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Seo
        title={t("privacy.seoTitle", { defaultValue: t("seo.title") })}
        description={t("privacy.seoDescription", { defaultValue: t("seo.description") })}
      />
      <SectionWrapper bgColor="bg-white">
        <main className="bg-white px-4 py-12" aria-label={t("privacy.pageDescription")}>
          <div className="mx-auto max-w-3xl space-y-6 text-left text-sm leading-relaxed text-gray-800">
            <p className="text-xs text-gray-500">{t("privacy.lastUpdated")}</p>

            <h1 className="text-2xl font-bold">{t("privacy.title")}</h1>
            <p>{t("privacy.intro")}</p>

            {[...Array(12)].map((_, i) => {
              const index = i + 1;
              return (
                <div key={index}>
                  <h2 className="mt-6 text-lg font-semibold">
                    {t(`privacy.points.${index}.title`)}
                  </h2>
                  <p>{t(`privacy.points.${index}.text`)}</p>
                </div>
              );
            })}
          </div>
        </main>
      </SectionWrapper>
    </>
  );
};

export default PrivacyPage;

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
