// /components/HomeTrySection :
import React from "react";
import { useTranslation } from "gatsby-plugin-react-i18next";
import CTAButton from "./CTAButton"; 
import SectionWrapper from "../components/SectionWrapper";

const HomeTrySection = () => {
  const { t } = useTranslation();

  return (
    <SectionWrapper bgColor="bg-black">
      <section className="bg-black text-white">
        <div className="mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-between w-full mb-10 px-6 lg:px-0">
          
          {/* Linkerkant: Grote tekst en CTA-button */}
          <div className="w-full lg:w-6/12 text-center lg:text-left mb-10 lg:mb-0 max-w-[700px]">
          <h2 className="text-[6rem] font-extrabold leading-[1.0]">
              {t("try.title").split("\n").map((line, index) => (
                <React.Fragment key={index}>{line}<br /></React.Fragment>
              ))}
            </h2>
            <div className="mt-14">
              <CTAButton />
            </div>
          </div>

          {/* Rechterkant: Tekstblok met vertaling */}
          <div className="w-full lg:w-5/12 text-center lg:text-left text-gray-300 font-light text-4xl leading-snug">
            <p className="text-[2.5rem]">
              {t("try.text").split("\n").map((line, index) => (
                <React.Fragment key={index}>{line}<br /></React.Fragment>
              ))}
            </p>
          </div>
        </div>
      </section>
    </SectionWrapper>
  );
};

export default HomeTrySection;
