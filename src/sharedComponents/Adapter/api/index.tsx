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
    return axios.get(`https://data.elrond.com/latestcomplete/quoteshistorical/egld/price`, {
      timeout,
    });
  },
  getEgldMarketCapHistory: (props: ProviderPropsType) => {
    const { timeout } = props;
    return axios.get(`https://data.elrond.com/latestcomplete/quoteshistorical/egld/market_cap`, {
      timeout,
    });
  },
  getEgldVolumeHistory: (props: ProviderPropsType) => {
    const { timeout } = props;
    return axios.get(`https://data.elrond.com/latestcomplete/quoteshistorical/egld/volume_24h`, {
      timeout,
    });
  },
  getTotalStakedHistory: (props: ProviderPropsType) => {
    const { timeout } = props;
    return axios.get(`https://data.elrond.com/latestcomplete/stakinghistorical/total/value`, {
      timeout,
    });
  },
  getUsersStaking: (props: ProviderPropsType) => {
    const { timeout } = props;
    return axios.get(`https://data.elrond.com/latest/stakinghistorical/total/users`, {
      timeout,
    });
  },
  getTransactionsHistory: (props: ProviderPropsType) => {
    const { timeout } = props;
    return axios.get(
      `https://data.elrond.com/latestcomplete/transactionshistorical/transactions/count_24h`,
      {
        timeout,
      }
    );
  },
  getAccountsHistory: (props: ProviderPropsType) => {
    const { timeout } = props;
    return axios.get(`https://data.elrond.com/latestcomplete/accountshistorical/accounts/count`, {
      timeout,
    });
  },
  getGrowthMetrics: (props: ProviderPropsType) => {
    const { timeout } = props;
    return axios.get(`https://tools.elrond.com/growth-api/explorer/charts`, {
      timeout,
    });
  },
};

export default apiAdapter;
