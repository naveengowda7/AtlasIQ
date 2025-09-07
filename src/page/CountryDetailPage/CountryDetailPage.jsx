import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { useCountryDetail } from "../../hooks/useCountryDetail";
import { BorderCountries } from "../../components/features/countries/BorderCountries/BorderCountries";
import { Spinner } from "../../components/ui/spinner/spinner";
import "./CountryDetailPage.css";

export const CountryDetailPage = () => {
  const [isDark] = useTheme();
  const navigate = useNavigate();
  const { countryData, loading, notFound } = useCountryDetail();

  if (loading) {
    return <Spinner />;
  }

  if (notFound) {
    return <div>Country Not Found</div>;
  }

  if (!countryData) {
    return <Spinner />;
  }

  return (
    <main className={`${isDark ? "dark" : ""}`}>
      <div className="country-details-container">
        <span className="back-button" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left"></i>&nbsp; Back
        </span>

        <div className="country-details">
          <img
            src={countryData.flags.svg}
            alt={`${countryData.name.common} flag`}
          />
          <div className="details-text-container">
            <h1>{countryData.name.common}</h1>
            <div className="details-text">
              <p>
                <b>
                  Native Name:{" "}
                  {Object.values(countryData.name.nativeName || {})[0]
                    ?.common || countryData.name.common}
                </b>
              </p>
              <p>
                <b>
                  Population: {countryData.population.toLocaleString("en-IN")}
                </b>
              </p>
              <p>
                <b>Region: {countryData.region}</b>
              </p>
              <p>
                <b>Sub Region: {countryData.subregion}</b>
              </p>
              <p>
                <b>Capital: {countryData.capital?.join(", ")}</b>
              </p>
              <p>
                <b>Top Level Domain: {countryData.tld?.join(", ")}</b>
              </p>
              <p>
                <b>
                  Currencies:{" "}
                  {Object.values(countryData.currencies || {})
                    .map((c) => c.name)
                    .join(", ")}
                </b>
              </p>
              <p>
                <b>
                  Languages:{" "}
                  {Object.values(countryData.languages || {}).join(", ")}
                </b>
              </p>
            </div>

            <BorderCountries
              borderCountries={countryData.borderCountriesDetails}
            />

            {countryData.borderCountriesMissing > 0 && (
              <div className="loading-borders">
                Loading {countryData.borderCountriesMissing} more border
                countries...
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
