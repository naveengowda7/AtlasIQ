import { createSelector } from "@reduxjs/toolkit";
import { countriesAdapter } from "./countriesSlice";
import { hasFullData } from "./countriesSlice";

export const {
  selectAll: selectAllCountries,
  selectById: selectCountryById,
  selectIds: selectCountryIds,
} = countriesAdapter.getSelectors((state) => state.countries);

export const selectCountriesStatus = (state) => state.countries.status;
export const selectCurrentCountryCode = (state) => state.countries.currentCountry;
export const selectSearchQuery = (state) => state.countries.searchQuery;
export const selectFilterUnit = (state) => state.countries.filterUnit;

export const selectCurrentCountryWithBorders = createSelector(
  [selectAllCountries, selectCurrentCountryCode],
  (countries, currentCountryCode) => {
    if (!currentCountryCode) return null;
    const country = countries.find(c => c.cca3 === currentCountryCode);
    if (!country) return null;

    const borderCountries = country.borders
      ? country.borders
        .map(borderCode => countries.find(c => c.cca3 === borderCode))
        .filter(Boolean)
      : [];

    const borderCountriesMissing = country.borders
      ? country.borders.filter(borderCode => {
        const borderCountry = countries.find(c => c.cca3 === borderCode);
        return !borderCountry || !hasFullData(borderCountry);
      }).length
      : 0;

    return {
      ...country,
      borderCountriesDetails: borderCountries,
      borderCountriesMissing: borderCountriesMissing
        ? country.borders.filter(borderCode =>
          !countries.find(c => c.cca3 === borderCode)
        ).length
        : 0,
      hasFullData: hasFullData(country)
    };
  }
);

// Fixed selector that properly combines search and filter
export const selectQueryFilterCountries = createSelector(
  [selectAllCountries, selectSearchQuery, selectFilterUnit],
  (countries, searchQuery = "", filterUnit = {}) => {
    let filteredCountries = countries;

    // Apply region/subregion filter first
    const { region, subregion } = filterUnit;
    if (region || subregion) {
      filteredCountries = countries.filter((country) => {
        if (region && subregion) {
          // Both region and subregion specified
          return country.region?.toLowerCase() === region.toLowerCase() &&
            country.subregion?.toLowerCase() === subregion.toLowerCase();
        } else if (region) {
          // Only region specified
          return country.region?.toLowerCase() === region.toLowerCase();
        } else if (subregion) {
          // Only subregion specified
          return country.subregion?.toLowerCase() === subregion.toLowerCase();
        }
        return true;
      });
    }

    // Apply search query filter
    if (searchQuery && searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      filteredCountries = filteredCountries.filter(country =>
        country.name?.common?.toLowerCase().includes(query) ||
        country.name?.official?.toLowerCase().includes(query) ||
        country.capital?.some(capital => capital.toLowerCase().includes(query)) ||
        country.region?.toLowerCase().includes(query) ||
        country.subregion?.toLowerCase().includes(query)
      );
    }

    return filteredCountries;
  }
);

export const selectCountryNeedsFullData = createSelector(
  [selectAllCountries, (_, countryCode) => countryCode],
  (countries, countryCode) => {
    if (!countryCode) return true;
    const country = countries.find(c => c.cca3 === countryCode);
    return !country || !hasFullData(country);
  }
);