import React from "react";
import Layout from "../components/Layout";
import { Link } from "gatsby";

const NotFoundPage = () => {
  return (
    <Layout>
      <section className="text-center py-16 bg-gray-50">
        <div className="container mx-auto">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">404</h1>
          <p className="text-lg text-gray-600 mb-8">
            Sorry, the page you are looking for does not exist here.
          </p>
          <Link
            to="/"
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
          >
            Go Back to Homepage
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default NotFoundPage;
