import axios from 'axios';

import {
  AdapterProviderType,
  AdapterProviderPropsType
} from 'types/adapter.types';

const api: AdapterProviderType = ({ baseUrl, url, params, timeout }) => {
  if (!baseUrl) {
    return Promise.resolve();
  }
  return axios.get(`${baseUrl}${url}`, { params, timeout });
};

export const apiAdapter = {
  provider: api,
  getStats: ({ baseUrl, timeout }: AdapterProviderPropsType) => {
    return api({
      baseUrl,
      url: '/stats',
      timeout
    });
  },
  getNodes: api,
  getNodesVersions: ({ baseUrl, timeout }: AdapterProviderPropsType) => {
    return api({
      baseUrl,
      url: '/nodes/versions',
      timeout
    });
  },
  getShards: ({ baseUrl, timeout }: AdapterProviderPropsType) => {
    return api({
      baseUrl,
      url: '/shards',
      timeout
    });
  },
  getAccountDelegation: api,
  getAccountDelegationLegacy: api,
  getAccountStake: api,
  getProviders: api,
  getProvider: api,
  getEconomics: api,
  getAnalyticsChartList: api,
  getAnalyticsChart: api,
  getGrowthWidget: api,
  getMarkers: api,
  getAccountContractVerification: api
};
