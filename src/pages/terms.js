// src/pages/en/terms.js
import { graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import Seo from "../components/Seo";
import SectionWrapper from "../components/SectionWrapper";

const TermsPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Seo
        title={t("terms.seoTitle", { defaultValue: t("seo.title") })}
        description={t("terms.seoDescription", { defaultValue: t("seo.description") })}
      />
      <SectionWrapper bgColor="bg-white">
        <main className="bg-white px-4 py-12" aria-label={t("terms.pageDescription")}>
          <div className="mx-auto max-w-3xl space-y-6 text-left text-sm leading-relaxed text-gray-800">
            <p className="text-xs text-gray-500">{t("terms.lastUpdated")}</p>

            <h1 className="text-2xl font-bold">{t("terms.title")}</h1>
            <p>{t("terms.intro")}</p>

            {[...Array(14)].map((_, i) => {
              const index = i + 1;
              return (
                <div key={index}>
                  <h2 className="mt-6 text-lg font-semibold">{t(`terms.points.${index}.title`)}</h2>
                  <p>{t(`terms.points.${index}.text`)}</p>
                </div>
              );
            })}
          </div>
        </main>
      </SectionWrapper>
    </>
  );
};

export default TermsPage;

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
