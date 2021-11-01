import stats from './stats';
import nodes from './nodes';
import shards from './shards';
import elastic from './helpers';
import { ProviderPropsType } from '../helpers';

export default {
  provider: elastic,
  getStats: (props: ProviderPropsType & { proxyUrl: string }) => {
    const { proxyUrl, baseUrl: elasticUrl, metaChainShardId } = props;
    return stats({
      proxyUrl,
      elasticUrl,
      metaChainShardId,
    });
  },
  getNodes: (props: ProviderPropsType & { proxyUrl: string }) => {
    const { proxyUrl: nodeUrl, params, url = '' } = props;
    return nodes({
      nodeUrl,
      url,
      params,
    });
  },
  getShards: (props: ProviderPropsType & { proxyUrl: string }) => {
    const { proxyUrl } = props;
    return shards({ proxyUrl });
  },
  getNodesVersions: () => {
    throw new Error('not defined');
  },
  getAccountDelegation: () => {
    throw new Error('not defined');
  },
  getAccountDelegationLegacy: () => {
    throw new Error('not defined');
  },
  getAccountStake: () => {
    throw new Error('not defined');
  },
  getEconomics: () => {
    throw new Error('not defined');
  },
  getProviders: () => {
    throw new Error('not defined');
  },
  getProvider: () => {
    throw new Error('not defined');
  },
  getEgldPriceHistory: () => {
    throw new Error('not defined');
  },
  getEgldMarketCapHistory: () => {
    throw new Error('not defined');
  },
  getEgldVolumeHistory: () => {
    throw new Error('not defined');
  },
  getTotalStakedHistory: () => {
    throw new Error('not defined');
  },
  getUsersStaking: () => {
    throw new Error('not defined');
  },
  getTransactionsHistory: () => {
    throw new Error('not defined');
  },
  getAccountsHistory: () => {
    throw new Error('not defined');
  },
};
