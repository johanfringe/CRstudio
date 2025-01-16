import React from "react";
// import Head from "./Head";
// import Header from "./Header";
// import Footer from "./Footer";

// Debugging logica
console.log("Seo utils import check:", { useSeoConfig, generateMetaTags }); 

const Layout = ({ children, pageContext, pageMetadata }) => {
  return (
    <>
      <Head pageContext={pageContext} pageMetadata={pageMetadata} />
      <main>{children}</main>
    </>
  );
};

export default Layout;
