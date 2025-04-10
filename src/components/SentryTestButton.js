// src/components/SentryTestButton.js
import React from "react";

export default function SentryTestButton() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gray-100 text-center p-4">
      <h1 className="text-3xl font-bold">🧪 Sentry Testpagina</h1>
      <p className="text-gray-600 max-w-lg">
        Klik op de knop hieronder om een testfout te veroorzaken. Als alles goed is ingesteld,
        verschijnt deze fout in je <strong>Sentry Dashboard</strong> en wordt de sessie opgenomen met Replay.
      </p>
      <button
        onClick={() => {
          throw new Error("🚨 Dit is een Sentry testfout!");
        }}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded shadow"
      >
        Genereer fout voor Sentry
      </button>
    </div>
  );
}
