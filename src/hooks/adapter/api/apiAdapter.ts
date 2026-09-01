import axios from 'axios';

import { AdapterProviderType } from 'types/adapter.types';

const api: AdapterProviderType = ({
  baseUrl,
  url,
  params,
  timeout,
  signal,
  headers
}) => {
  if (!baseUrl) {
    return Promise.resolve();
  }
  return axios.get(`${baseUrl}${url}`, {
    params,
    timeout,
    signal,
    headers
  });
};

export const apiAdapter = {
  provider: api
};
