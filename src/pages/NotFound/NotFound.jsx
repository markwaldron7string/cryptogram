import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => (
  <div className="not-found page-container">
    <h1>404</h1>
    <p>The page you&apos;re looking for doesn&apos;t exist.</p>
    <Link to="/" className="btn-primary">
      Back to markets
    </Link>
  </div>
);

export default NotFound;
