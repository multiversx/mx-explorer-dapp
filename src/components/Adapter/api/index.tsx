import axios from 'axios';
import { ProviderType, ProviderPropsType } from '../helpers';

const api: ProviderType = ({ baseUrl, url, params, timeout }) => {
  return axios.get(`${baseUrl}${url}`, { params, timeout });
};

export const apiAdapter = {
  provider: api,
  getStats: ({ baseUrl, timeout }: ProviderPropsType) => {
    return api({
      baseUrl,
      url: '/stats',
      timeout
    });
  },
  getNodes: api,
  getNodesVersions: ({ baseUrl, timeout }: ProviderPropsType) => {
    return api({
      baseUrl,
      url: '/nodes/versions',
      timeout
    });
  },
  getShards: ({ baseUrl, timeout }: ProviderPropsType) => {
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
  getEgldPriceHistory: api,
  getEgldMarketCapHistory: api,
  getTotalStakedHistory: api,
  getUsersStaking: api,
  getTransactionsHistory: api,
  getAccountsHistory: api,
  getAnalyticsChartList: api,
  getAnalyticsChart: api,
  getGrowthWidget: api
};
