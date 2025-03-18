// src/pages/index.js :

import React from "react";
import { graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import Seo from "../components/Seo";

// >>> PAGE COMPONENT <<<
const PrivacyPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Seo />
      <main>
        <h1>{t("welcome_message")}</h1>
        <p>{t("description")}</p>
      </main>
    </>
  );
}

export default PrivacyPage;

// >>> GATSBY-PLUGIN-REACT-I18NEXT QUERY <<<
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