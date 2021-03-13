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
  getAccountDelegation: () => {
    throw new Error('not defined');
  },
  getAccountStake: () => {
    throw new Error('not defined');
  },
  getEconomics: () => {
    throw new Error('not defined');
  },
  getEgldPrice: () => {
    throw new Error('not defined');
  },
};
