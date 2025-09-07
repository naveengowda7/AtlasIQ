import { configureStore } from "@reduxjs/toolkit";
import countriesReducer from "../features/countries/countriesSlice"

export const store = configureStore({
  reducer: {
    countries: countriesReducer
  }
})

export default store;