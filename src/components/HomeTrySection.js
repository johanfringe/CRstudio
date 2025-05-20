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
        <div className="mx-auto mb-10 flex w-full flex-col items-center justify-center px-6 lg:flex-row lg:items-start lg:justify-between lg:px-0">
          {/* Linkerkant: Grote tekst en CTA-button */}
          <div className="mb-10 w-full max-w-[700px] text-center lg:mb-0 lg:w-6/12 lg:text-left">
            <h2 className="text-[6rem] font-extrabold leading-[1.0]">
              {t("try.title")
                .split("\n")
                .map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
            </h2>
            <div className="mt-14">
              <CTAButton />
            </div>
          </div>

          {/* Rechterkant: Tekstblok met vertaling */}
          <div className="w-full text-center text-4xl font-light leading-snug text-gray-300 lg:w-5/12 lg:text-left">
            <p className="text-[2.5rem]">
              {t("try.text")
                .split("\n")
                .map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
            </p>
          </div>
        </div>
      </section>
    </SectionWrapper>
  );
};

export default HomeTrySection;
