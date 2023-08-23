import { AdapterProviderPropsType } from 'types/adapter.types';

import { elastic } from './helpers';
import { nodes } from './nodes';
import { shards } from './shards';
import { getStats as stats } from './stats';

export const elasticAdapter = {
  provider: elastic,
  getStats: (props: AdapterProviderPropsType & { proxyUrl: string }) => {
    const { proxyUrl, baseUrl: elasticUrl, metaChainShardId } = props;
    return stats({
      proxyUrl,
      elasticUrl,
      metaChainShardId
    });
  },
  getNodes: (props: AdapterProviderPropsType & { proxyUrl: string }) => {
    const { proxyUrl: nodeUrl, params, url = '' } = props;
    return nodes({
      nodeUrl,
      url,
      params
    });
  },
  getShards: (props: AdapterProviderPropsType & { proxyUrl: string }) => {
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
  getAnalyticsChartList: () => {
    throw new Error('not defined');
  },
  getAnalyticsChart: () => {
    throw new Error('not defined');
  },
  getGrowthWidget: () => {
    throw new Error('not defined');
  },
  getMarkers: () => {
    throw new Error('not defined');
  },
  getAccountContractVerification: () => {
    throw new Error('not defined');
  },
  getAccountUpgrades: () => {
    throw new Error('not defined');
  },
  getAccounRoles: () => {
    throw new Error('not defined');
  }
};
