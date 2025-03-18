// /components/Footer :
import React from "react";
import { Link } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok, FaWeixin, FaTwitter, FaYoutube } from "react-icons/fa";
import TrySection from "../components/HomeTrySection";

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-black py-10 mt-auto md:sticky bottom-0 w-full">
      <TrySection />
      
      <div className="max-w-screen-xl mx-auto px-[min(5vw,2rem)] flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
        
        {/* ✅ Linkerkant */}
        <div className="text-lg font-bold text-white text-center md:text-left">
          <p>CRstudio</p>
          <p className="text-base font-bold text-gray-300">
            {t("footer.slogan").split("\n").map((line, index) => (
              <React.Fragment key={index}>{line}<br /></React.Fragment>
            ))}
          </p>
        </div>

        {/* ✅ Midden */}
        <div className="text-sm text-gray-400 text-center">
          <p>&copy; 2025 CRstudio bv</p>
          <div className="flex space-x-4 justify-center mt-2 border-t border-gray-700 pt-2">
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">
              {t("footer.privacy")}
            </Link>
            <span className="text-gray-500">|</span>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">
              {t("footer.terms")}
            </Link>
          </div>
        </div>

        {/* ✅ Rechterkant - Social Icons */}
        <div className="flex space-x-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebookF className="w-5 h-5 text-white hover:text-gray-400 transition-colors" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram className="w-5 h-5 text-white hover:text-gray-400 transition-colors" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedinIn className="w-5 h-5 text-white hover:text-gray-400 transition-colors" />
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <FaTiktok className="w-5 h-5 text-white hover:text-gray-400 transition-colors" />
          </a>
          <a href="https://wechat.com" target="_blank" rel="noopener noreferrer" aria-label="WeChat">
            <FaWeixin className="w-5 h-5 text-white hover:text-gray-400 transition-colors" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <FaTwitter className="w-5 h-5 text-white hover:text-gray-400 transition-colors" />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <FaYoutube className="w-5 h-5 text-white hover:text-gray-400 transition-colors" />
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
