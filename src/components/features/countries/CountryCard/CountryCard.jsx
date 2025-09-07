import React from "react";
import { Link } from "react-router-dom";
import "./CountryCard.css";

export const CountryCard = ({ country }) => {
  return (
    <Link
      className="country-card"
      to={`/${country.name.common}`}
      state={{ cca3: country.cca3 }}
    >
      <div className="flag-container">
        <img src={country.flags.svg} alt={`${country.name.common} Flag`} />
      </div>
      <div className="card-text">
        <h3 className="card-title">{country.name.common}</h3>
        <p>
          <b>Population: </b>
          {country.population.toLocaleString("en-IN")}
        </p>
        <p>
          <b>Region: </b>
          {country.region}
        </p>
        <p>
          <b>Capital: </b>
          {country.capital?.[0]}
        </p>
      </div>
    </Link>
  );
};
