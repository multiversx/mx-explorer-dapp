import axios from 'axios';
import { ProviderType } from './../functions';

const api: ProviderType = ({ baseUrl, url, params, timeout }) => {
  return axios.get(`${baseUrl}${url}`, { params, timeout });
};

export default api;
