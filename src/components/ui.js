// /src/components/ui.js :
import React from "react";
export const Button = ({ children, ...props }) => (
  <button className="rounded bg-blue-500 px-4 py-2 text-white" {...props}>
    {children}
  </button>
);

export const Input = ({ ...props }) => <input className="w-full rounded border p-2" {...props} />;
