import React from "react";
import { LanguageProvider } from "./src/context/LanguageProvider";

export const wrapRootElement = ({ element }) => (
  <LanguageProvider>{element}</LanguageProvider>
);
