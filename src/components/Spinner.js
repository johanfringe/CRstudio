// src/components/Spinner.js :
import React from "react";
const Spinner = () => {
  return (
    <div className="flex h-32 w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-gray-900" />
    </div>
  );
};

export default Spinner;
