import axios from 'axios';
import { ProviderType, ProviderPropsType } from '../helpers';

const api: ProviderType = ({ baseUrl, url, params, timeout }) => {
  return axios.get(`${baseUrl}${url}`, { params, timeout });
};

export default {
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
  getAccountStake: api,
  getProviders: api,
  getProvider: api,
  getEconomics: api,
  getEgldPrice: (props: ProviderPropsType) => {
    const { timeout } = props;
    return axios.get(`https://data.elrond.com/latest/quotes/egld/price`, { timeout });
  },
  getEgldMarketCap: (props: ProviderPropsType) => {
    const { timeout } = props;
    return axios.get(`https://data.elrond.com/latest/quotes/egld/market_cap`, { timeout });
  },
  getEgldPriceHistory: (props: ProviderPropsType) => {
    const { timeout } = props;
    return axios.get(`https://data.elrond.com/marketcomplete/quotes/egld/price`, { timeout });
  },
  getEgldMarketCapHistory: (props: ProviderPropsType) => {
    const { timeout } = props;
    return axios.get(`https://data.elrond.com/marketcomplete/quotes/egld/market_cap`, { timeout });
  },
  getEgldVolumeHistory: (props: ProviderPropsType) => {
    const { timeout } = props;
    return axios.get(`https://data.elrond.com/latestcomplete/quotes/egld/volume_24h`, {
      timeout,
    });
  },
  getTotalStakedHistory: (props: ProviderPropsType) => {
    const { timeout } = props;
    return axios.get(`https://data.elrond.com/latestcomplete/economics/economics/staked`, {
      timeout,
    });
  },
  getUsersStaking: (props: ProviderPropsType) => {
    const { timeout } = props;
    return axios.get(`https://data.elrond.com/latest/staking/total/count`, {
      timeout,
    });
  },
  getTransactionsHistory: (props: ProviderPropsType) => {
    const { timeout } = props;
    return axios.get(`https://data.elrond.com/latestcomplete/transactions/transactions/count_24h`, {
      timeout,
    });
  },
  getAccountsHistory: (props: ProviderPropsType) => {
    const { timeout } = props;
    return axios.get(`https://data.elrond.com/latestcomplete/accounts/accounts/count`, {
      timeout,
    });
  },
};
