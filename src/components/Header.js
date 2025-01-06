import React, { useState, useContext } from "react";
import { useStaticQuery, graphql } from "gatsby";
import { LanguageContext } from "../context/LanguageProvider";
import Brand from "./Brand";
import languages from "../config/languages"; // Importeer talenconfiguratie

const Header = () => {
  const [isOpen, setIsOpen] = useState(false); // Hamburger menu state
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown menu state
  const { language, switchLanguage } = useContext(LanguageContext);

  const data = useStaticQuery(graphql`
    query {
      allLanguagesJson {
        nodes {
          header {
            links {
              demo
              pricing
              contact
              login
              signup
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
    data.allLanguagesJson.nodes.find(node => node.parent.name === "en");

  return (
    <header className="sticky top-0 bg-white z-50">
      <nav className="container mx-auto flex items-center justify-between p-4">
        {/* Brand Component */}
        <div className="flex items-center">
          <Brand />
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="/demo" className="nav-link">{content.header.links.demo}</a>
          <a href="/pricing" className="nav-link">{content.header.links.pricing}</a>
          <a href="/contact" className="nav-link">{content.header.links.contact}</a>
          <a href="/login" className="nav-link">{content.header.links.login}</a>

          {/* Language Selector */}
          <div className="relative">
            <button
              className="flex items-center px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 font-roboto font-medium"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {(language || "SELECT").toLowerCase()} 
              <span style={{ fontSize: "12px", marginLeft: "5px" }}>▼</span>
            </button>
            {dropdownOpen && (
              <div className="absolute mt-2 bg-white shadow-md rounded-md w-32">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      switchLanguage(lang.code);
                      setDropdownOpen(false); // Sluit dropdown na selectie
                    }}
                    className="block w-full text-left px-4 py-1 hover:bg-gray-100 font-roboto font-medium"
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <a href="/signup" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-roboto font-medium">
            {content.header.links.signup}
          </a>
        </div>

        {/* Hamburger Menu */}
        <button
          className="md:hidden text-4xl text-gray-700 hover:text-gray-900"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          ☰
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-start space-y-2 px-4">
          <a href="/demo" className="mobile-nav-link">{content.header.links.demo}</a>
          <a href="/pricing" className="mobile-nav-link">{content.header.links.pricing}</a>
          <a href="/contact" className="mobile-nav-link">{content.header.links.contact}</a>
          <a href="/login" className="mobile-nav-link">{content.header.links.login}</a>
          <a href="/signup" className="mobile-nav-link">{content.header.links.signup}</a>
        </div>
      )}
    </header>
  );
};

export default Header;
