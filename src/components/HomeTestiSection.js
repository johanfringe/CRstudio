import React from "react";
import { useTranslation } from "gatsby-plugin-react-i18next";
import SectionWrapper from "../components/SectionWrapper";

const testimonials = [
  "testi.feature_1",
  "testi.feature_2",
  "testi.feature_3",
  "testi.feature_4",
];

const clients = [
  "testi.client_1",
  "testi.client_2",
  "testi.client_3",
  "testi.client_4",
];

const HomeTestiSection = () => {
  const { t } = useTranslation();

  return (
    <SectionWrapper bgColor="bg-gray-100 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl text-gray-900 max-w-4xl mx-auto">
          {t("testi.testimonial_title")}
        </h1>
      </div>

      {/* 2x2 Grid van testimonia-cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
        {testimonials.map((testi, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 flex flex-col"
          >
            <p className="text-xl text-gray-700 mb-2">" {t(testi)} "</p>
            <p className="text-base italic text-gray-600">- {t(clients[index])}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default HomeTestiSection;
