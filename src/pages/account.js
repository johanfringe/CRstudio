// src/pages/account.js : = login pagina in de kunstenaarssites
import React from "react";
import { graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import Seo from "../components/Seo";
import SectionWrapper from "../components/SectionWrapper";

const AccountPage = () => {
  const { t } = useTranslation("template", "translation"); // 'template' aanpassen !!!

  return (
    <>
      <Seo // vervang 3x 'template' en zet alles in translation
        title={t("template.seoTitle", { defaultValue: t("seo.title") })}
        description={t("template.seoDescription", { defaultValue: t("seo.description") })}
      />
      <SectionWrapper bgColor="bg-white">
        <main className="bg-gray-50 px-4 py-10" aria-label={t("template.pageDescription")}>
          <div className="container mx-auto flex max-w-7xl flex-col space-y-16 px-4 sm:px-6 md:px-8 lg:flex-row lg:space-x-8 lg:space-y-0">
            {/* ✅ Linkerkant*/}
            <section className="w-full lg:w-6/12">... ... ...</section>

            {/* ✅ Rechterkant*/}
            <section className="w-full lg:w-5/12">... ... ...</section>
          </div>
        </main>
      </SectionWrapper>
    </>
  );
};

export default AccountPage;

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
