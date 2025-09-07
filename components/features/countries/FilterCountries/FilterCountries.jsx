import React from "react";
import { REGIONS } from "../../../../utils/constants";
import { useCountries } from "../../../../hooks/useCountries";
import { selectFilterUnit } from "../../../../features/countries/countriesSelectors";
import { useSelector } from "react-redux";

const FilterCountries = () => {
  const { updateFilterQuery } = useCountries();
  const filterUnit = useSelector(selectFilterUnit);

  const { region } = filterUnit;

  const handleRegionChange = (e) => {
    const selected = e.target.value;
    updateFilterQuery({ region: selected, subregion: "" });
  };

  const handleReset = () => {
    updateFilterQuery({ region: "", subregion: "" });
  };

  return (
    <div className="flex gap-4 items-center flex-wrap">
      {/* Region dropdown */}
      <select
        value={region}
        onChange={handleRegionChange}
        className="border rounded-lg p-2 shadow-sm bg-white dark:bg-gray-800 dark:text-white"
      >
        <option value="">Filter by Region</option>
        {REGIONS.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      {/* Reset button */}
      {region && (
        <button
          onClick={handleReset}
          className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          Reset
        </button>
      )}
    </div>
  );
};

export default FilterCountries;
