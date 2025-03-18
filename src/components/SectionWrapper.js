// src/components/SectionWrapper.js :
import React from "react";

const SectionWrapper = ({ children, bgColor }) => {
  return (
    <section className={`w-full ${bgColor}`}>
      <div className="max-w-screen-xl mx-auto py-14 px-[min(5vw,2rem)]">
        {children}
      </div>
    </section>
  );
};

export default SectionWrapper;
