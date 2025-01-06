import React, { useContext } from "react";
import { useStaticQuery, graphql } from "gatsby";
import { LanguageContext } from "../context/LanguageProvider";
import InstagramLink from "./socialslinks/InstagramLink";
import FacebookLink from "./socialslinks/FacebookLink";
import LinkedInLink from "./socialslinks/LinkedInLink";
import TikTokLink from "./socialslinks/TikTokLink";
import WeChatLink from "./socialslinks/WeChatLink";
import XLink from "./socialslinks/XLink";
import YouTubeLink from "./socialslinks/YouTubeLink";

const Footer = () => {
  const { language } = useContext(LanguageContext);

  const data = useStaticQuery(graphql`
    query {
      allLanguagesJson {
        nodes {
          footer {
            links {
              partners
              cookies
              legal
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

  // Dynamische inhoud gebaseerd op de taal
  const content =
    data.allLanguagesJson.nodes.find(node => node.parent.name === language) ||
    data.allLanguagesJson.nodes.find(node => node.parent.name === "en"); // Fallback naar Engels

  return (
    <footer className="bg-gray-100 text-gray-600 py-6 px-3 md:px-5 lg:px-7">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Copyright */}
        <p className="text-sm font-roboto text-center md:text-left">
          &copy; 2025 CRstudio BV
        </p>

        {/* Dynamische Links */}
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="/partners" className="footer-link">{content.footer.links.partners}</a>
          <a href="/cookies" className="footer-link">{content.footer.links.cookies}</a>
          <a href="/legal" className="footer-link">{content.footer.links.legal}</a>
        </div>

        {/* Social Media */}
<div className="flex space-x-4 mt-4 md:mt-0">
  <InstagramLink />
  <FacebookLink />
  <LinkedInLink />
  <TikTokLink />
  <WeChatLink />
  <XLink />
  <YouTubeLink />
</div>
      </div>
    </footer>
  );
};

export default Footer;
