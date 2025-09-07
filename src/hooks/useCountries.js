import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchAllCountries,
  fetchCountryByName,
  fetchCountryWithBorders,
  setCurrentCountryFromCache,
  setFilterUnit,
  setSearchQuery,
} from '../features/countries/countriesSlice';
import {
  selectAllCountries,
  selectCurrentCountryWithBorders,
  selectCountriesStatus,
  selectQueryFilterCountries,
} from '../features/countries/countriesSelectors';

export const useCountries = () => {
  const dispatch = useDispatch();

  const countries = useSelector(selectAllCountries);
  const currentCountry = useSelector(selectCurrentCountryWithBorders);
  const status = useSelector(selectCountriesStatus);
  const filterqueryCountries = useSelector(selectQueryFilterCountries);

  const loading = status === "loading";

  const loadAllCountries = useCallback(() => {
    dispatch(fetchAllCountries());
  }, [dispatch]);

  const loadCountryWithBorders = useCallback(
    (code) => dispatch(fetchCountryWithBorders(code)),
    [dispatch]
  );

  const setCurrentFromCache = useCallback(
    (code) => dispatch(setCurrentCountryFromCache(code)),
    [dispatch]
  );

  const loadCountryByName = useCallback(
    (name) => dispatch(fetchCountryByName(name)),
    [dispatch]
  );

  const updateSearchQuery = useCallback(
    (query) => dispatch(setSearchQuery(query)),
    [dispatch]
  );

  const updateFilterQuery = useCallback(
    (filterUnit) => dispatch(setFilterUnit(filterUnit)),
    [dispatch]
  );

  return {
    countries,
    currentCountry,
    loading,
    filterqueryCountries,
    loadAllCountries,
    loadCountryWithBorders,
    loadCountryByName,
    updateSearchQuery,
    updateFilterQuery,
    setCurrentFromCache,
  };
};

