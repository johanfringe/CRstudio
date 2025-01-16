// src/pages/404.js
import React from "react";

const NotFoundPage = () => (
  <main className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h1 className="text-4xl font-bold">404 - Pagina niet gevonden</h1>
      <p className="text-lg mt-4">
        De pagina die je zoekt bestaat niet. Controleer het webadres of ga
        terug naar de <a href="/" className="text-blue-500 underline">homepagina</a>.
      </p>
    </div>
  </main>
);

export default NotFoundPage;
