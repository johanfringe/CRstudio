// /components/HomeFeatureSection :
import React from "react";
import { useEffect, useRef } from "react";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CTAButton from "../components/CTAButton";
import SectionWrapper from "../components/SectionWrapper";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ✅ **kleuren van de <h1/>**
const titleColors = ["text-purple-900", "text-blue-600", "text-red-500"];

// ✅ **Feature-secties array opnieuw toegevoegd**
const features = [
  {
    titleKey: "feature.title_1",
    subtitleKey: "feature.subtitle_1",
    descriptionKey: "feature.description_1",
    video: "/images/Featurevideo1.webm",
    image: "/images/Featureimage1.jpeg",
  },
  {
    titleKey: "feature.title_2",
    subtitleKey: "feature.subtitle_2",
    descriptionKey: "feature.description_2",
    video: "/images/Featurevideo2.webm",
    image: "/images/Featureimage2.jpeg",
  },
  {
    titleKey: "feature.title_3",
    subtitleKey: "feature.subtitle_3",
    descriptionKey: "feature.description_3",
    video: "/images/Featurevideo3.webm",
    image: "/images/Featureimage3.jpeg",
  },
];

const HomeFeatureSection = () => {
  console.log("Rendering [componentnaam]", Date.now());

  const { t } = useTranslation();
  const sectionsRef = useRef([]); // ✅ Array refs voor GSAP

  useEffect(() => {
    if (typeof window === "undefined") return; // 🚀 Voorkomt SSR-fouten

    gsap.registerPlugin(ScrollTrigger);

    const sections = sectionsRef.current.filter(Boolean); // ✅ Filter lege refs

    if (!sections.length) return;

    sections.forEach(section => {
      if (!section) return;

      const textBlock = section.querySelector(".feature-text");
      const image = section.querySelector(".feature-image");
      const video = section.querySelector(".feature-video");
      const description = section.querySelector(".feature-description");
      const ctaButton = section.querySelector(".feature-cta");

      // ✅ **Tekst fade-in (titel, subtitel en description)
      gsap.fromTo(
        textBlock,
        { opacity: 0, y: 40 }, // 🔹 Startpositie: xx px beneden zijn originele positie
        {
          opacity: 1, // 🔹 Eindstatus: volledig zichtbaar
          y: 0, // 🔹 Eindpositie: 0 = originele positie
          duration: 2, // 🔹 Tijd (sec) om van zijn start- naar zijn eindpositie te gaan
          ease: "power2.out", // 🔹 power2.out : zachte overgang met trage stop
          scrollTrigger: {
            trigger: textBlock,
            start: "top 60%", // 🔹 Start wanneer de bovenkant van het tekstblok xx% van het schermhoogte heeft bereikt
            toggleActions: "play none none reverse",
          },
        }
      );

      // ✅ **Description fade-in
      gsap.fromTo(
        [description, ctaButton],
        { opacity: 0, y: 40 }, // 🔹 Unieke startwaarden
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          delay: 0.8, // 🔹 begint met zijn animatie x sec later dan titel/subtitel
          scrollTrigger: {
            trigger: textBlock,
            start: "top 55%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // ✅ **Afbeelding fade-in
      gsap.set(image, { opacity: 1, y: 200 });
      gsap.to(image, {
        opacity: 1,
        y: -100,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // ✅ **video fade-in
      gsap.set(video, { opacity: 1, y: 300 });
      gsap.to(video, {
        opacity: 1,
        y: -200,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => sections.forEach(section => ScrollTrigger.getById(section)?.kill());
  }, []);

  return (
    <div className="">
      {features.map((feature, index) => (
        <SectionWrapper bgColor="bg-white" key={index}>
          <div
            ref={el => (sectionsRef.current[index] = el)} // ✅ **Callback-ref**
            className="relative flex flex-col items-center gap-4 overflow-hidden text-center"
          >
            {/* ✅ Tekstsectie */}
            <div className="feature-text w-full max-w-3xl">
              <h1 className={`mb-3 text-lg font-semibold ${titleColors[index]}`}>
                {t(feature.titleKey)}
              </h1>
              <h2 className="mb-3 text-3xl font-normal text-gray-900">{t(feature.subtitleKey)}</h2>
              <p className="feature-description mt-2 text-lg font-light text-gray-500">
                {t(feature.descriptionKey)}
              </p>
              {/* ✅ CTA-Knop */}
              <div className="feature-cta mb-16 mt-8">
                <CTAButton />
              </div>
            </div>

            {/* ✅ Media: Video en Afbeelding */}
            <div className="relative flex w-full flex-col items-center justify-center lg:flex-row">
              {/* Video links */}
              <div className="relative z-10 w-full lg:w-[65%]">
                {" "}
                {/* lg=%van totale lengte, zie afb */}
                <video
                  src={feature.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="feature-video w-full rounded-lg shadow-lg"
                />
              </div>

              {/* Afbeelding rechts, overlappend op grotere schermen */}
              <div className="relative mt-4 hidden w-full lg:-ml-[10%] lg:mt-0 lg:block lg:w-[35%]">
                {" "}
                {/* lg:-ml = overlap */}
                <img
                  src={feature.image}
                  alt="Feature"
                  className="feature-image w-full rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </SectionWrapper>
      ))}
    </div>
  );
};

export default HomeFeatureSection;
