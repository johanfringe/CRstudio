// src/pages/404.js :
import { graphql } from "gatsby";
import { useTranslation, Link } from "gatsby-plugin-react-i18next";

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <main className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl">{t("notfound.title")}</h1>
        <p className="mt-10 text-lg">{t("notfound.message")}</p>
        <p className="mt-10 text-lg">
          {" "}
          <Link to="/" className="text-blue-500 underline">
            {t("notfound.homeLink")}
          </Link>
        </p>
      </div>
    </main>
  );
};

export default NotFoundPage;

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
