// src/pages/index2.js :

import React from "react";
import { graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import Seo from "../components/Seo";

// >>> PAGE COMPONENT <<<
const Index2Page = () => {
  const { t } = useTranslation();

  return (
    <>
      <Seo // vervang 'template' en zet alles in translation
        title={t("template.seoTitle", { defaultValue: t("seo.title") })} 
        description={t("template.seoDescription", { defaultValue: t("seo.description") })}
      />
      <main>
        <h1>{t("welcome_message")}</h1>
        <p>{t("description")}</p>
      </main>
    </>
  );
}

export default Index2Page;

export const query = graphql`
  query($language: String!) {
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
