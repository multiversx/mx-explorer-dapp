import getStats from './getStats';
import elastic from './helpers';
import { ProviderPropsType } from './../functions';

export default {
  provider: elastic,
  getStats: (props: ProviderPropsType & { proxyUrl: string }) => {
    const { proxyUrl, baseUrl: elasticUrl, metaChainShardId } = props;
    return getStats({
      proxyUrl,
      elasticUrl,
      metaChainShardId,
    });
  },
};
