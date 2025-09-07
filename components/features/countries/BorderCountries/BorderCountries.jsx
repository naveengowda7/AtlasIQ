import React from "react";
import { Link } from "react-router-dom";
import "./BorderCountries.css";

export const BorderCountries = ({ borderCountries }) => {
  if (!borderCountries || borderCountries.length === 0) {
    return null;
  }

  return (
    <div className="border-countries">
      <b>Border Countries: </b>
      {borderCountries.map((border) => (
        <Link
          key={border.cca3}
          to={`/${border.name.common}`}
          state={{ cca3: border.cca3 }}
        >
          {border.name.common}
        </Link>
      ))}
    </div>
  );
};
