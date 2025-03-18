// src/pages/404.js :
import React from "react";
import { graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { Link } from "gatsby-plugin-react-i18next";

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <main className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl">{t("notfound.title")}</h1>
        <p className="text-lg mt-10">
          {t("notfound.message")}</p>
          <p className="text-lg mt-10"> <Link to="/" className="text-blue-500 underline">
            {t("notfound.homeLink")}
          </Link>
        </p>
      </div>
    </main>
  );
};

export default NotFoundPage;

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
