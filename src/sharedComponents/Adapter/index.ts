import { useGlobalState } from 'context';
import elastic from './elastic';
import api from './api';
import { getLatestBlocks, getLatestTransactions, getBlocks, GetBlocksType } from './functions';

const providers = {
  api,
  elastic,
};

export default function useAdapter() {
  const {
    activeTestnet: { elasticUrl, adapter },
    timeout,
  } = useGlobalState();

  const provider = providers[adapter];

  return {
    getLatestBlocks: () => getLatestBlocks({ provider, elasticUrl, timeout }),
    getLatestTransactions: () => getLatestTransactions({ provider, elasticUrl, timeout }),
    getBlocks: ({ size, shardId, epochId }: GetBlocksType) =>
      getBlocks({ provider, elasticUrl, size, shardId, epochId, timeout }),
  };
}
