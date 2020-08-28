import { useGlobalState } from 'context';
import elastic from './elastic';
import api from './api';
import {
  getHighlights,
  getLatestBlocks,
  getLatestTransactions,
  getBlock,
  getBlocks,
  GetBlocksType,
  getBlocksCount,
  getTransaction,
  getPendingTransaction,
  getMiniBlock,
  getMiniBlockTransactions,
  getMiniBlockTransactionsCount,
  TransactionsType,
  getTransactions,
  getTransactionsCount,
  getAddressDetails,
  getRewards,
  isBlock,
  isAddress,
  isTransaction,
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
    /* Homepage */

    getHighlights: () =>
      getHighlights({ provider, proxyUrl, elasticUrl, timeout, metaChainShardId }),

    getLatestBlocks: () => getLatestBlocks({ provider, elasticUrl, timeout }),

    getLatestTransactions: () => getLatestTransactions({ provider, elasticUrl, timeout }),

    /* Blocks */

    getBlock: ({ blockId }: { blockId: string }) =>
      getBlock({ provider, elasticUrl, blockId, timeout }),

    getBlocks: ({ size, shardId, epochId }: GetBlocksType) =>
      getBlocks({ provider, elasticUrl, size, shardId, epochId, timeout }),

    getBlocksCount: ({ size, shardId, epochId }: GetBlocksType) =>
      getBlocksCount({ provider, elasticUrl, size, shardId, epochId, timeout }),

    /* Transaction */

    getTransaction: ({ transactionId }: { transactionId: string }) =>
      getTransaction({ provider, elasticUrl, transactionId, timeout }),

    getPendingTransaction: ({ transactionId }: { transactionId: string }) =>
      getPendingTransaction({ proxyUrl, transactionId, timeout }),

    /* Miniblocks */

    getMiniBlock: ({ miniBlockHash }: { miniBlockHash: string }) =>
      getMiniBlock({ provider, elasticUrl, miniBlockHash, timeout }),

    getMiniBlockTransactions: ({ miniBlockHash, size }: { miniBlockHash: string; size: number }) =>
      getMiniBlockTransactions({ provider, elasticUrl, miniBlockHash, timeout, size }),

    getMiniBlockTransactionsCount: ({ miniBlockHash }: { miniBlockHash: string }) =>
      getMiniBlockTransactionsCount({ provider, miniBlockHash, timeout, elasticUrl }),

    /* Transactions */

    getTransactions: ({ size, addressId, shardId, shardType }: TransactionsType) =>
      getTransactions({ provider, elasticUrl, timeout, addressId, size, shardId, shardType }),

    getTransactionsCount: ({ size, addressId, shardId, shardType }: TransactionsType) =>
      getTransactionsCount({ provider, elasticUrl, timeout, addressId, size, shardId, shardType }),

    getAddressDetails: ({ addressId }: { addressId: string }) =>
      getAddressDetails({ proxyUrl, timeout, addressId }),

    getRewards: ({ addressId }: { addressId: string }) =>
      getRewards({ proxyUrl, timeout, addressId }),

    /* Search */

    isBlock: ({ hash }: { hash: string }) => isBlock({ provider, elasticUrl, hash, timeout }),

    isAddress: ({ hash }: { hash: string }) => isAddress({ proxyUrl, hash, timeout }),

    isTransaction: ({ hash }: { hash: string }) =>
      isTransaction({ provider, elasticUrl, proxyUrl, hash, timeout }),
  };
}
