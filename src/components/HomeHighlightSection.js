// /components/HomeHighlightSection :
import React, { useEffect, useRef } from "react";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionWrapper from "../components/SectionWrapper";
import { Link } from "gatsby";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const HighlightSection = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const textRefs = useRef([]);

  const lines = [
    t("highlight.sentence_1"),
    t("highlight.sentence_2"),
    t("highlight.sentence_3"),
    t("highlight.sentence_4"),
    t("highlight.sentence_5"),
  ];

  // ✅ Kleur array van de zinnen
  const colorClasses = [
    "text-gray-900",
    "text-gray-900",
    "text-gray-900",
    "text-gray-900",
    "text-rose-400",
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    textRefs.current.forEach((wordArray, index) => {
      if (!wordArray) return;

      gsap.set(wordArray, { opacity: 0.3 });

      gsap.to(wordArray, {
        opacity: 1,
        stagger: 0.15,
        duration: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: wordArray[0]?.parentNode,
          start: "top 40%",
          toggleActions: "play none none reverse",
        },
      });
    });

    return () => ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }, []);

  return (
    <SectionWrapper bgColor="bg-gray-100">
      <div ref={sectionRef} className="max-w-4xl mx-auto text-center space-y-10">
        {lines.map((line, index) => (
          <p key={index} className={`text-2xl md:text-4xl font-light !leading-normal ${colorClasses[index]}`}>
            {line.split(" ").map((word, wordIndex) => (
              <span
                key={wordIndex}
                ref={(el) => {
                  if (!textRefs.current[index]) textRefs.current[index] = [];
                  textRefs.current[index][wordIndex] = el;
                }}
                className="inline-block mx-1"
              >
                {/* ✅ Dynamisch de juiste kleur voor de link */}
                {index === lines.length - 1 ? (
                  <Link to="/register" className={`${colorClasses[index]} hover:underline`}>
                    {word}
                  </Link>
                ) : (
                  word
                )}
              </span>
            ))}
          </p>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default HighlightSection;
