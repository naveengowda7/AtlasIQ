import { createAsyncThunk, createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { countriesAPI } from './countriesApi';

export const countriesAdapter = createEntityAdapter({
  selectId: (country) => country.cca3,
  sortComparer: (a, b) => a.name?.common?.localeCompare(b.name?.common || "") || 0,
});

const initialState = countriesAdapter.getInitialState({
  status: 'idle',
  error: null,
  currentCountry: null,
  lastFetched: 0,
  searchQuery: '',
  filterUnit: {
    region: '',
  },
  borderLoadingStatus: {},
});

export const hasFullData = (country) => {
  return country && country.tld;
}

// Fetch all countries
export const fetchAllCountries = createAsyncThunk(
  'countries/fetchAll',
  async () => {
    return await countriesAPI.fetchAll();
  }
);

// Fetch country by code
export const fetchCountryByCode = createAsyncThunk(
  'countries/fetchByCode',
  async (code) => {
    return await countriesAPI.fetchByCode(code);
  },
  {
    condition: (code, { getState }) => {
      if (!code) return false;
      const { countries } = getState();
      const existingCountry = countries.entities[code];

      if (!existingCountry || !hasFullData(existingCountry)) {
        return true;
      }

      return false;
    }
  }
);

// Fetch country by name
export const fetchCountryByName = createAsyncThunk(
  'countries/fetchByName',
  async (name) => {
    return await countriesAPI.fetchByName(name);
  }
);

// Fetch missing border countries
export const fetchMissingBorderCountries = createAsyncThunk(
  'countries/fetchMissingBorders',
  async (borderCodes, { getState }) => {
    const { countries } = getState();
    const missingCodes = borderCodes.filter(code => {
      const existingCountry = countries.entities[code];
      return !existingCountry || !hasFullData(existingCountry);
    });

    if (missingCodes.length === 0) {
      return [];
    }

    return await countriesAPI.fetchMultipleByCode(missingCodes);
  },
  {
    condition: (borderCodes, { getState }) => {
      if (!borderCodes || borderCodes.length === 0) return false;

      const { countries } = getState();
      const missingCodes = borderCodes.filter(code => {
        const existingCountry = countries.entities[code];
        return !existingCountry || !hasFullData(existingCountry);
      });

      return missingCodes.length > 0;
    }
  }
);
export const setCurrentCountryFromCache = createAsyncThunk(
  'countries/setCurrentFromCache',
  async (code, { getState }) => {
    const { countries } = getState();
    const country = countries.entities[code];
    return country;
  },
  {
    condition: (code, { getState }) => {
      if (!code) return false;
      const { countries } = getState();
      return !!countries.entities[code]; // Only if country exists in cache
    }
  }
);

// Fetch country with borders
export const fetchCountryWithBorders = createAsyncThunk(
  'countries/fetchCountryWithBorders',
  async (code, { dispatch, getState }) => {

    const { countries } = getState();
    let country = countries.entities[code];

    if (!country || !hasFullData(country)) {
      const result = await dispatch(fetchCountryByCode(code));
      country = result.payload;
    } else {
      console.log(`Using cached data for country: ${code}`);
    }

    if (country?.borders && country.borders.length > 0) {
      await dispatch(fetchMissingBorderCountries(country.borders));
    }

    return country;
  }, {
  condition: (code, { getState }) => {
    if (!code) return false;

    const { countries } = getState();
    const country = countries.entities[code];

    // Always allow if main country needs fetching
    if (!country || !hasFullData(country)) {
      return true;
    }

    // Check if any border countries need fetching
    if (country.borders && country.borders.length > 0) {
      const needsFetching = country.borders.some(borderCode => {
        const borderCountry = countries.entities[borderCode];
        return !borderCountry || !hasFullData(borderCountry);
      });

      if (needsFetching) {
        return true;
      }
    }

    return false;
  }
}
);

const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {
    setCurrentCountry: (state, action) => {
      state.currentCountry = action.payload;
    },
    clearCurrentCountry: (state) => {
      state.currentCountry = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilterUnit: (state, action) => {
      state.filterUnit = action.payload
    }
    ,
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all countries
      .addCase(fetchAllCountries.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllCountries.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lastFetched = Date.now();
        countriesAdapter.upsertMany(state, action.payload);
      })
      .addCase(fetchAllCountries.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Fetch country by code
      .addCase(fetchCountryByCode.fulfilled, (state, action) => {
        countriesAdapter.upsertOne(state, action.payload);
        state.currentCountry = action.payload.cca3;
      })

      // Fetch country by name
      .addCase(fetchCountryByName.fulfilled, (state, action) => {
        countriesAdapter.upsertOne(state, action.payload);
        state.currentCountry = action.payload.cca3;
      })

      // Fetch missing borders
      .addCase(fetchMissingBorderCountries.pending, (state, action) => {
        const borderCodes = action.meta.arg;
        borderCodes.forEach(code => {
          state.borderLoadingStatus[code] = 'loading';
        });
      })
      .addCase(fetchMissingBorderCountries.fulfilled, (state, action) => {
        const borderCodes = action.meta.arg;
        countriesAdapter.upsertMany(state, action.payload);
        borderCodes.forEach(code => {
          state.borderLoadingStatus[code] = 'succeeded';
        });
      })

      // Fetch country with borders
      .addCase(fetchCountryWithBorders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCountryWithBorders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentCountry = action.payload.cca3;
      }).addCase(setCurrentCountryFromCache.fulfilled, (state, action) => {
        state.currentCountry = action.payload.cca3;
      })
  }
});

export const { setCurrentCountry, clearCurrentCountry, setSearchQuery, setFilterUnit, clearError } = countriesSlice.actions;
export default countriesSlice.reducer;