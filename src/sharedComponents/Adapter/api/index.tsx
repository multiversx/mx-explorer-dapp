import axios from 'axios';
import { ProviderType, ProviderPropsType } from '../helpers';

const api: ProviderType = ({ baseUrl, url, params, timeout }) => {
  return axios.get(`${baseUrl}${url}`, { params, timeout });
};

const apiAdapter = {
  provider: api,
  getStats: ({ baseUrl, timeout }: ProviderPropsType) => {
    return api({
      baseUrl,
      url: `/stats`,
      timeout,
    });
  },
  getNodes: api,
  getNodesVersions: ({ baseUrl, timeout }: ProviderPropsType) => {
    return api({
      baseUrl,
      url: `/nodes/versions`,
      timeout,
    });
  },
  getShards: ({ baseUrl, timeout }: ProviderPropsType) => {
    return api({
      baseUrl,
      url: `/shards`,
      timeout,
    });
  },
  getAccountDelegation: api,
  getAccountDelegationLegacy: api,
  getAccountStake: api,
  getProviders: api,
  getProvider: api,
  getEconomics: api,
  getEgldPriceHistory: (props: ProviderPropsType) => {
    const { timeout } = props;
    return axios.get(`https://tools.multiversx.com/growth-api/charts?types=price`, {
      timeout,
    });
  },
  getEgldMarketCapHistory: (props: ProviderPropsType) => {
    const { timeout } = props;
    return axios.get(`https://tools.multiversx.com/growth-api/charts?types=market-cap`, {
      timeout,
    });
  },
  getTotalStakedHistory: (props: ProviderPropsType) => {
    const { timeout } = props;
    return axios.get(`https://tools.multiversx.com/growth-api/charts?types=staking-metrics`, {
      timeout,
    });
  },
  getUsersStaking: (props: ProviderPropsType) => {
    const { timeout } = props;
    return axios.get(`https://tools.multiversx.com/growth-api/charts?types=staking-metric`, {
      timeout,
    });
  },
  getTransactionsHistory: (props: ProviderPropsType) => {
    const { timeout } = props;
    return axios.get(`https://tools.multiversx.com/growth-api/charts?types=transaction-metrics`, {
      timeout,
    });
  },
  getAccountsHistory: (props: ProviderPropsType) => {
    const { timeout } = props;
    return axios.get(`https://tools.multiversx.com/growth-api/charts?types=address-metrics`, {
      timeout,
    });
  },
};

export default apiAdapter;
