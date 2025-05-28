// /components/HomeTestiSection.js :
import React from "react";
import { useTranslation } from "gatsby-plugin-react-i18next";
import SectionWrapper from "../components/SectionWrapper";

const testimonials = ["testi.feature_1", "testi.feature_2", "testi.feature_3", "testi.feature_4"];

const clients = ["testi.client_1", "testi.client_2", "testi.client_3", "testi.client_4"];

const HomeTestiSection = () => {
  const { t } = useTranslation();

  return (
    <SectionWrapper bgColor="bg-gray-100 py-10">
      <div className="mb-12 text-center">
        <h1 className="mx-auto max-w-4xl text-4xl text-gray-900 md:text-5xl">
          {t("testi.testimonial_title")}
        </h1>
      </div>

      {/* 2x2 Grid van testimonia-cards */}
      <div className="mx-auto mb-16 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
        {testimonials.map((testi, index) => (
          <div
            key={index}
            className="flex flex-col rounded-lg border border-gray-300 bg-white p-6 shadow-lg"
          >
            <p className="mb-2 text-xl text-gray-700">&ldquo; {t(testi)} &ldquo;</p>
            <p className="text-base italic text-gray-600">- {t(clients[index])}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default HomeTestiSection;
