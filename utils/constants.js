export const CACHE_TIME = 10 * 60 * 1000;

export const API_ENDPOINTS = {
  ALL_COUNTRIES: '/all?fields=cca3,name,flags,population,region,capital,languages,currencies',

  COUNTRY_BY_NAME: (name) => `/name/${encodeURIComponent(name)}?fullText=true`,

  COUNTRY_BY_CODE: (code) => `/alpha/${code}`,

  MULTIPLE_BY_CODE: (codes) => `/alpha?codes=${codes.join(',')}`,
}

export const REGIONS = [
  "Africa",
  "Americas",
  "Asia",
  "Europe",
  "Oceania",
  "Antarctic"
]

export const SUB_REGION = [
  "Northern Africa",
  "Sub-Saharan Africa",
  "Caribbean",
  "Central America",
  "South America",
  "Northern America",
  "Central Asia",
  "Eastern Asia",
  "Southern Asia",
  "South-Eastern Asia",
  "Western Asia",
  "Eastern Europe",
  "Northern Europe",
  "Southern Europe",
  "Western Europe",
  "Australia and New Zealand",
  "Melanesia",
  "Micronesia",
  "Polynesia",
  "Antarctica"
]

