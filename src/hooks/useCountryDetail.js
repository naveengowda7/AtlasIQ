import { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useCountries } from "./useCountries";

export const useCountryDetail = () => {
  const { country: countryName } = useParams();
  const { state } = useLocation();

  const { currentCountry, loading, loadCountryByName, loadCountryWithBorders, setCurrentFromCache } = useCountries();

  useEffect(() => {

    if (state?.cca3) {
      loadCountryWithBorders(state.cca3);
    } else if (countryName) {
      loadCountryByName(countryName);
    }
    setCurrentFromCache(state?.cca3)
  }, [countryName, state?.cca3]);

  return {
    countryData: currentCountry,
    loading,
    notFound: !loading && !currentCountry
  };
};