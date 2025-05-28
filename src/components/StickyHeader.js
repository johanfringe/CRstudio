// src/components/StickyHeader.js :
import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link as GatsbyLink, graphql, useStaticQuery } from "gatsby";
import { Link as ScrollLink } from "react-scroll";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { GatsbyImage } from "gatsby-plugin-image";
import LanguageSwitcher from "./LanguageSwitcher";
import { motion, AnimatePresence } from "framer-motion";

const StickyHeader = ({ sections }) => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState(""); // ✅ Actieve sectie wordt correct bijgehouden
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const data = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "CRlogo.jpg" }) {
        childImageSharp {
          gatsbyImageData(width: 100, layout: FIXED)
        }
      }
    }
  `);

  // ✅ Sluit menu bij klik buiten het menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // ✅ Actieve sectie bijhouden met IntersectionObserver
  useEffect(() => {
    if (!sections || sections.length === 0) return;

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            console.log("🌍 Actieve sectie", { id: entry.target.id });
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0.3 }
    );

    const observedSections = sections.map(({ id }) => document.getElementById(id)).filter(Boolean);

    observedSections.forEach(section => observer.observe(section));

    return () => {
      observedSections.forEach(section => observer.unobserve(section));
      observer.disconnect();
    };
  }, [sections]);

  return (
    <motion.header
      className="sticky top-0 z-50 bg-white"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <nav className="mx-auto flex max-w-screen-xl items-center justify-between px-[min(5vw,2rem)] py-4">
        {/* ✅ Logo */}
        <div className="flex items-center">
          <GatsbyLink to="/" className="flex items-center" aria-label={t("stheader.logo_label")}>
            <GatsbyImage
              image={data.file.childImageSharp.gatsbyImageData}
              alt={t("stheader.logo_alt")}
            />
          </GatsbyLink>
        </div>

        {/* ✅ Desktop Navigatie */}
        <ul className="hidden items-center space-x-6 lg:flex">
          {sections.map(({ id, label }) => (
            <li key={id}>
              <ScrollLink
                to={id}
                smooth="easeInOutQuint"
                duration={800}
                offset={-57}
                spy
                activeClass="text-black border-b-2 border-black"
                onClick={() => setActiveSection(id)}
                className={`relative cursor-pointer px-4 py-2 text-sm font-medium text-gray-800 hover:text-black ${
                  activeSection === id ? "border-b-2 border-black text-black" : ""
                }`}
              >
                {t(label)}
              </ScrollLink>
            </li>
          ))}
        </ul>

        {/* ✅ Rechtersectie */}
        <div className="hidden items-center space-x-4 lg:flex">
          <LanguageSwitcher />
          <GatsbyLink to="/register" className="btn btn-primary">
            {t("stheader.trial")}
          </GatsbyLink>
        </div>

        {/* ✅ Mobiele Menu Knop */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMenuOpen(prev => !prev)}
            className="p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle navigation"
            aria-expanded={isMenuOpen}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* ✅ Mobiel menu met animatie */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.ul
            ref={menuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute left-0 top-16 z-40 flex w-full flex-col space-y-1 bg-white p-6 text-center shadow-md"
          >
            {sections.map(({ id, label }) => (
              <li key={id} className="py-2">
                <ScrollLink
                  to={id}
                  smooth
                  duration={500}
                  offset={-57}
                  spy
                  activeClass="border-b-2 border-black inline-block"
                  onClick={() => {
                    setActiveSection(id);
                    setIsMenuOpen(false);
                  }}
                  className="px-2 text-sm text-gray-800 hover:text-black"
                >
                  {t(label)}
                </ScrollLink>
              </li>
            ))}

            <li className="py-2">
              <LanguageSwitcher />
            </li>
            <li className="py-2">
              <GatsbyLink
                to="/register"
                className="btn btn-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("stheader.trial")}
              </GatsbyLink>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default StickyHeader;
