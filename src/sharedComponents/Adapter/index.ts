import { useGlobalState } from 'context';
import elastic from './elastic';
import api from './api';
import {
  getHighlights,
  getLatestBlocks,
  getLatestTransactions,
  getBlocks,
  GetBlocksType,
  getBlocksCount,
  getTransaction,
  getPendingTransaction,
  getMiniBlock,
  getMiniBlockTransactions,
  getMiniBlockTransactionsCount,
} from './functions';

// TODO: daca pun ruta de elastic default

export default function useAdapter() {
  const {
    activeTestnet: { elasticUrl, adapter, nodeUrl },
    config: { metaChainShardId },
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
    getHighlights: () =>
      getHighlights({ provider, proxyUrl, elasticUrl, timeout, metaChainShardId }),

    getLatestBlocks: () => getLatestBlocks({ provider, elasticUrl, timeout }),

    getLatestTransactions: () => getLatestTransactions({ provider, elasticUrl, timeout }),

    getBlocks: ({ size, shardId, epochId }: GetBlocksType) =>
      getBlocks({ provider, elasticUrl, size, shardId, epochId, timeout }),

    getBlocksCount: ({ size, shardId, epochId }: GetBlocksType) =>
      getBlocksCount({ provider, elasticUrl, size, shardId, epochId, timeout }),

    getTransaction: ({ transactionId }: { transactionId: string }) =>
      getTransaction({ provider, elasticUrl, transactionId, timeout }),

    getPendingTransaction: ({ transactionId }: { transactionId: string }) =>
      getPendingTransaction({ proxyUrl, transactionId, timeout }),

    getMiniBlock: ({ miniBlockHash }: { miniBlockHash: string }) =>
      getMiniBlock({ provider, elasticUrl, miniBlockHash, timeout }),

    getMiniBlockTransactions: ({ miniBlockHash, size }: { miniBlockHash: string; size: number }) =>
      getMiniBlockTransactions({ provider, elasticUrl, miniBlockHash, timeout, size }),

    getMiniBlockTransactionsCount: ({ miniBlockHash }: { miniBlockHash: string }) =>
      getMiniBlockTransactionsCount({ provider, miniBlockHash, timeout, elasticUrl }),
  };
}
