import axios from 'axios';

interface ApiType {
  elasticUrl: string;
  url: string;
  params?: object;
  timeout: number;
}

const api = ({ elasticUrl, url, params, timeout }: ApiType) =>
  axios({
    method: 'GET',
    baseURL: elasticUrl,
    url,
    params,
    timeout,
  });

export default api;
