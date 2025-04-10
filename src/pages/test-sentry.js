// src/pages/test-sentry.js
import React from "react";
import SentryTestButton from "../components/SentryTestButton";
import { Helmet } from "react-helmet";

const TestSentryPage = () => {
  return (
    <>
      <Helmet>
        <title>Sentry Test | CRstudio</title>
        <meta name="description" content="Testpagina voor Sentry foutopsporing" />
      </Helmet>
      <SentryTestButton />
    </>
  );
};

export default TestSentryPage;
