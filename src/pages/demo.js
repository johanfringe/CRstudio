/* eslint-disable react/jsx-pascal-case */
import React, { useContext } from "react";
import { useStaticQuery, graphql } from "gatsby";
import Layout from "../components/Layout";
import SEO from "../components/SEO";
import { LanguageContext } from "../context/LanguageProvider";
import languages from "../config/languages"; // Importeer de talenconfiguratie

const DemoPage = () => {
  const { language } = useContext(LanguageContext);

  // Laad alle teksten op basis van de huidige taal
  const data = useStaticQuery(graphql`
    query {
      allLanguagesJson {
        nodes {
          demo {
            hero {
              title
              description
            }
            videos {
              title
              description
            }
          }
          parent {
            ... on File {
              name
            }
          }
        }
      }
    }
  `);

  const content =
    data.allLanguagesJson.nodes.find(node => node.parent.name === language) ||
    data.allLanguagesJson.nodes.find(node => node.parent.name === "en"); // Fallback naar Engels

  const demoContent = content.demo;

  // Dynamisch genereren van hreflangs
  const hreflangs = languages.map(({ code }) => ({
    hreflang: code,
    href: `https://www.crstudio.com/${code}/demo`,
  }));

  return (
    <Layout>
      <SEO
        title="Demo | CRstudio"
        description={demoContent.hero.description}
        lang={language}
        canonical={`https://www.crstudio.com/${language}/demo`}
        hreflangs={hreflangs} // Dynamische hreflangs
        ogImage="https://www.crstudio.com/images/demo-thumbnail.jpg"
        twitterCard="summary_large_image"
      />

      {/* Hero Sectie */}
      <section className="font-roboto py-10 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-roboto text-4xl font-bold text-gray-800 mb-4">{demoContent.hero.title}</h1>
          <p className="font-roboto text-lg text-gray-600">{demoContent.hero.description}</p>
        </div>
      </section>

      {/* Video's Sectie */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {demoContent.videos.map((video, index) => (
              <div key={index} className="rounded-lg overflow-hidden">
                <iframe
                  className="w-full aspect-video"
                  src={`https://www.youtube.com/embed/EXAMPLE${index + 1}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <div className="p-4">
                  <h2 className="font-roboto text-lg font-bold text-gray-800">{video.title}</h2>
                  <p className="font-roboto text-gray-600 text-sm">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DemoPage;
