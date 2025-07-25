import React from "react";
import { Link } from "react-router-dom";

export const Logo: React.FC = () => {
  return (
    <h1 className="m-0 font-bold text-2xl md:text-3xl">
      <Link 
        to="/" 
        className="inline-flex items-center transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 no-underline"
        aria-label="ホームに戻る"
      >
        <span className="font-sans tracking-tight text-amber-900 dark:text-amber-600">proteIn</span>
        <span className="font-sans tracking-tight text-amber-700 dark:text-amber-500">ternet</span>
      </Link>
    </h1>
  );
};

export default Logo;