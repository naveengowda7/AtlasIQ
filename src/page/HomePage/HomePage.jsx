import React, { useEffect, useMemo, useState } from "react";
import { CountriesList } from "../../components/features/countries/CountriesList/CountriesList";
import { useTheme } from "../../hooks/useTheme";
import "./HomePage.css";
import { useFilter } from "../../hooks/useFilter";
import FilterCountries from "../../components/features/countries/FilterCountries/FilterCountries";
import { useCountries } from "../../hooks/useCountries";

export const HomePage = () => {
  const [isDark] = useTheme();
  const [query, setQuery] = useState("");
  const debouncedQuery = useFilter(query, 300);
  const { updateSearchQuery } = useCountries();

  const isSearching = useMemo(() => {
    return query !== debouncedQuery && query.trim() !== "";
  }, [query, debouncedQuery]);

  useEffect(() => {
    updateSearchQuery(debouncedQuery);
  }, [debouncedQuery, updateSearchQuery]);

  const handleSearchChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
  };

  const handleSearchClear = () => {
    setQuery("");
  };


  return (
    <main className={isDark ? "dark" : ""}>
      <div className="search-filter-container">
        <div className="search-container">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            onChange={handleSearchChange}
            type="text"
            placeholder="Search for a country, region, or capital..."
            value={query}
          />
          {query && (
            <button
              className="search-clear-btn"
              onClick={handleSearchClear}
              aria-label="Clear search"
            >
              <i className="fa-solid fa-times"></i>
            </button>
          )}
        </div>
        {query && (
          <div className="search-info">
            {isSearching ? (
              <span>Searching...</span>
            ) : (
              <span>
                {debouncedQuery ? `Searching for "${debouncedQuery}"` : ""}
              </span>
            )}
          </div>
        )}
        <FilterCountries />
      </div>
      <CountriesList />
    </main>
  );
};
