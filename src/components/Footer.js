// /components/Footer :
import React from "react";
import { Link } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaWeixin,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import TrySection from "../components/HomeTrySection";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bottom-0 mt-auto w-full bg-black py-10 md:sticky">
      <TrySection />

      <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-between space-y-6 px-[min(5vw,2rem)] md:flex-row md:space-y-0">
        {/* ✅ Linkerkant */}
        <div className="text-center text-lg font-bold text-white md:text-left">
          <p>{t("footer.title")}</p>
          <p className="text-base font-bold text-gray-300">
            {t("footer.slogan")
              .split("\n")
              .map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
          </p>
        </div>

        {/* ✅ Midden */}
        <div className="text-center text-sm text-gray-400">
          <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
          <div className="mt-2 flex justify-center space-x-4 border-t border-gray-700 pt-2">
            <Link to="/privacy" className="transition-colors hover:text-gray-300">
              {t("footer.privacy")}
            </Link>
            <span className="text-gray-500">|</span>
            <Link to="/terms" className="transition-colors hover:text-gray-300">
              {t("footer.terms")}
            </Link>
          </div>
        </div>

        {/* ✅ Rechterkant - Social Icons */}
        <div className="flex space-x-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FaFacebookF className="h-5 w-5 text-white transition-colors hover:text-gray-400" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram className="h-5 w-5 text-white transition-colors hover:text-gray-400" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn className="h-5 w-5 text-white transition-colors hover:text-gray-400" />
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
          >
            <FaTiktok className="h-5 w-5 text-white transition-colors hover:text-gray-400" />
          </a>
          <a
            href="https://wechat.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WeChat"
          >
            <FaWeixin className="h-5 w-5 text-white transition-colors hover:text-gray-400" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <FaTwitter className="h-5 w-5 text-white transition-colors hover:text-gray-400" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
          >
            <FaYoutube className="h-5 w-5 text-white transition-colors hover:text-gray-400" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
