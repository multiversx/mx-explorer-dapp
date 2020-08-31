import axios from 'axios';
import { ProviderType } from './../functions';

const api: ProviderType = ({ providerUrl, url, params, timeout }) => {
  return axios.get(`${providerUrl}${url}`, { params, timeout });
};

export default api;
