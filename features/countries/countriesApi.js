import { API_ENDPOINTS } from '../../utils/constants';
import { api } from '../../utils/api';

export const countriesAPI = {
  fetchAll: async () => {
    const response = await api.get(API_ENDPOINTS.ALL_COUNTRIES);
    return response.data;
  },

  fetchByCode: async (code) => {
    const response = await api.get(API_ENDPOINTS.COUNTRY_BY_CODE(code));
    return response.data[0];
  },

  fetchByName: async (name) => {
    const response = await api.get(API_ENDPOINTS.COUNTRY_BY_NAME(name));
    return response.data[0];
  },

  fetchMultipleByCode: async (codes) => {
    if (!codes || codes.length === 0) return [];
    const response = await api.get(API_ENDPOINTS.MULTIPLE_BY_CODE(codes));
    return response.data;
  }
};