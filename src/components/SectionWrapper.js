// src/components/SectionWrapper.js :
const SectionWrapper = ({ children, bgColor }) => {
  return (
    <section className={`w-full ${bgColor}`}>
      <div className="mx-auto max-w-screen-xl px-[min(5vw,2rem)] py-14">{children}</div>
    </section>
  );
};

export default SectionWrapper;
