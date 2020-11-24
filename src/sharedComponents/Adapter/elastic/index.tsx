import stats from './stats';
import nodes from './nodes';
import elastic from './helpers';
import { ProviderPropsType } from './../functions';

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
};
