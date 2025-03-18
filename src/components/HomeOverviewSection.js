// components/OverviewSection
import React, { useLayoutEffect, useRef } from "react";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CTAButton from "../components/CTAButton";
import SectionWrapper from "../components/SectionWrapper";

gsap.registerPlugin(ScrollTrigger);

const OverviewSection = () => {
  const { t } = useTranslation();
  const textContainer = useRef(null);

  useLayoutEffect(() => {
    if (textContainer.current) {
      gsap.to(textContainer.current, {
        opacity: 0, // ✅ Fade out volledig
        scale: 0.80, // ✅ Krimpt naar 85% van de originele grootte
        duration: 0.3, // ✅ Voorkomt flikkering
        ease: "power2.out",
        scrollTrigger: {
          trigger: textContainer.current,
          start: "top 5%", // ✅ Start fading zodra het in het midden komt
          end: "bottom top", // ✅ Verdwijnt volledig zodra het uit beeld is
          scrub: true,
          onUpdate: (self) => {
            console.log(`🌍 Scroll progress: ${self.progress.toFixed(2)}`);
          },
        },
      });
    }
  }, []);

  return (
    <SectionWrapper bgColor="bg-white">
      {/* ✅ Container met initiële opacity-100 om flikkering te voorkomen */}
      <div className="sticky top-20 text-center mx-auto opacity-100" ref={textContainer}>
        {/* ✅ Titel */}
        <h1 className="text-7xl md:text-8xl font-medium leading-tight text-black mt-16 mb-6">
          {t("overview.title").split("\n").map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </h1>

        {/* ✅ Beschrijving */}
        <p className="text-xl text-gray-900 font-light leading-relaxed mb-8">
          {t("overview.description").split("\n").map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>

        {/* ✅ CTA-Knop */}
        <div className="mt-8 mb-16">
          <CTAButton />
        </div>
      </div>

      {/* ✅ Video-sectie */}
      <div className="relative z-10 flex justify-center">
        <video
          src="/images/Featurevideo1.webm"
          autoPlay
          loop
          muted
          playsInline
          className="w-full max-w-5xl rounded-lg shadow-lg"
        />
      </div>
    </SectionWrapper>
  );
};

export default OverviewSection;