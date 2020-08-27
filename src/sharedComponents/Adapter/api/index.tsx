import axios from 'axios';
import { ProviderType } from './../functions';

const api: ProviderType = ({ elasticUrl, url, params, timeout }) => {
  return axios.get(`${elasticUrl}${url}`, { params, timeout });
};

export default api;
