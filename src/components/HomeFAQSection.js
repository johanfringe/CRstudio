// /components/HomeFAQSection :
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { useTranslation } from "gatsby-plugin-react-i18next";
import SectionWrapper from "../components/SectionWrapper";

gsap.registerPlugin(ScrollTrigger);

const HomeFAQSection = () => {
  const { t } = useTranslation();
  const borderRef = useRef(null);
  const [expandedItems, setExpandedItems] = useState(
    Array(5).fill(true).concat(Array(10).fill(false)) // Eerste 5 open, 10 gesloten
  );
  const [allExpanded, setAllExpanded] = useState(false);

  useEffect(() => {
    const borderElement = borderRef.current;

    gsap.fromTo(
      borderElement,
      { width: "70%", height: "80%", paddingTop: "2rem" }, // Startbreedte en starthoogte
      {
        width: "100%",
        height: "100%", // Uitbreiding naar volledige hoogte
        paddingTop: "7rem", // Extra ruimte boven de titel
        borderRadius: "20px",
        duration: 2.5,
        ease: "linear",
        scrollTrigger: {
          trigger: borderElement,
          start: "top 40%",
          end: "top",
          scrub: true,
          toggleActions: "play reverse play reverse",
        },
      }
    );
  }, []);

  const toggleItem = index => {
    setExpandedItems(prev => {
      const updatedItems = [...prev];
      updatedItems[index] = !updatedItems[index];
      return updatedItems;
    });
  };

  const toggleAll = () => {
    const newState = !allExpanded;
    setExpandedItems(Array(15).fill(newState));
    setAllExpanded(newState);
  };

  return (
    <SectionWrapper bgColor="bg-white">
      <div ref={borderRef} className="relative mx-auto overflow-hidden rounded-2xl bg-gray-900 p-6">
        <div className="relative mx-auto max-w-screen-md rounded-2xl bg-gray-900 p-6 shadow-lg">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-bold leading-tight text-gray-200 md:text-5xl">
              {t("faq.title")}
            </h2>
          </div>

          <div className="mb-4 flex justify-end">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex cursor-pointer items-center text-lg font-bold text-gray-200"
              onClick={toggleAll}
            >
              <span className="whitespace-nowrap">
                {allExpanded ? t("faq.collapse_all") : t("faq.expand_all")}
              </span>
              <motion.span
                animate={{ rotate: allExpanded ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="ml-2 text-xl font-bold"
              >
                {allExpanded ? "−" : "+"}
              </motion.span>
            </motion.div>
          </div>

          <div className="faq-content space-y-4">
            {[...Array(15)].map((_, index) => (
              <div key={index} className="border-b border-gray-600">
                <button
                  className="flex w-full items-center justify-between px-0 py-4 text-left text-lg font-semibold text-gray-200 focus:outline-none"
                  onClick={() => toggleItem(index)}
                >
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    {t(`faq.q${index + 1}`)}
                  </motion.span>
                  <motion.span
                    animate={{ rotate: expandedItems[index] ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="text-xl font-bold"
                  >
                    {expandedItems[index] ? "−" : "+"}
                  </motion.span>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: expandedItems[index] ? "auto" : 0,
                    opacity: expandedItems[index] ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pb-4 text-gray-400">{t(`faq.a${index + 1}`)}</div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default HomeFAQSection;
