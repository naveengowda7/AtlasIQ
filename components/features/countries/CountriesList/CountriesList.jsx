import React, { useEffect } from "react";
import { CountryCard } from "../CountryCard/CountryCard";
import { Spinner } from "../../../ui/spinner/spinner";
import { useCountries } from "../../../../hooks/useCountries";

export const CountriesList = () => {
  const { filterqueryCountries, loading, loadAllCountries } = useCountries();

  useEffect(() => {
    loadAllCountries();
  }, [loadAllCountries]);

  if (loading && filterqueryCountries.length === 0) {
    return <Spinner />;
  }

  if (filterqueryCountries.length === 0 && !loading) {
    return (
      <div className="no-results">
        <p>No countries found matching your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="countries-container">
      {filterqueryCountries.map((country) => (
        <CountryCard key={country.cca3} country={country} />
      ))}
    </div>
  );
};
