import { useGlobalState } from 'context';
import elastic from './elastic';
import api from './api';
import {
  getLatestBlocks,
  getLatestTransactions,
  getBlocks,
  GetBlocksType,
  getBlocksCount,
  getTransaction,
  getPendingTransaction,
} from './functions';

// TODO: daca pun ruta de elastic default

export default function useAdapter() {
  const {
    activeTestnet: { elasticUrl, adapter, nodeUrl },
    timeout,
  } = useGlobalState();

  const providers = {
    api: {
      provider: api,
      proxyUrl: elasticUrl,
    },
    elastic: {
      provider: elastic,
      proxyUrl: nodeUrl,
    },
  };

  const { provider, proxyUrl } = providers[adapter];

  return {
    getLatestBlocks: () => getLatestBlocks({ provider, elasticUrl, timeout }),
    getLatestTransactions: () => getLatestTransactions({ provider, elasticUrl, timeout }),
    getBlocks: ({ size, shardId, epochId }: GetBlocksType) =>
      getBlocks({ provider, elasticUrl, size, shardId, epochId, timeout }),
    getBlocksCount: ({ size, shardId, epochId }: GetBlocksType) =>
      getBlocksCount({ provider, elasticUrl, size, shardId, epochId, timeout }),
    getTransaction: ({ transactionId }: { transactionId: string }) =>
      getTransaction({ provider, elasticUrl, transactionId, timeout }),
    getPendingTransaction: ({ transactionId }: { transactionId: string }) =>
      getPendingTransaction({ baseUrl: proxyUrl, transactionId, timeout }),
  };
}
