import { useGlobalState } from 'context';
import elastic from './elastic';
import api from './api';
import * as f from './functions';

export default function useAdapter() {
  const {
    activeNetwork: { elasticUrl, adapter, proxyUrl: nodeUrl, apiUrl },
    config: { metaChainShardId },
    timeout,
  } = useGlobalState();

  // TODO: ramane apiUrl un singur url ptr api
  // la elastic ramane proprietatea proxyUrl si elasticUrl

  const providers = {
    api: {
      provider: api,
      baseUrl: apiUrl || '',
      proxyUrl: apiUrl || '',
    },
    elastic: {
      provider: elastic,
      baseUrl: elasticUrl || '',
      proxyUrl: nodeUrl || '',
    },
  };

  const { provider, proxyUrl, baseUrl } = providers[adapter];

  return {
    /* Homepage */

    getHighlights: () =>
      f.getHighlights({ provider, proxyUrl, baseUrl, timeout, metaChainShardId }),

    getLatestBlocks: () => f.getLatestBlocks({ provider, baseUrl, timeout }),

    getLatestTransactions: () => f.getLatestTransactions({ provider, baseUrl, timeout }),

    /* Blocks */

    getBlock: ({ blockId }: { blockId: string }) =>
      f.getBlock({ provider, baseUrl, blockId, timeout }),

    getBlocks: ({ size, shardId, epochId }: f.GetBlocksType) =>
      f.getBlocks({ provider, baseUrl, size, shardId, epochId, timeout }),

    getBlocksCount: ({ size, shardId, epochId }: f.GetBlocksType) =>
      f.getBlocksCount({ provider, baseUrl, size, shardId, epochId, timeout }),

    /* Transaction */

    getTransaction: ({ transactionId }: { transactionId: string }) =>
      f.getTransaction({ provider, baseUrl, transactionId, timeout }),

    /* Miniblocks */

    getMiniBlock: ({ miniBlockHash }: { miniBlockHash: string }) =>
      f.getMiniBlock({ provider, baseUrl, miniBlockHash, timeout }),

    getMiniBlockTransactions: ({ miniBlockHash, size }: { miniBlockHash: string; size: number }) =>
      f.getMiniBlockTransactions({ provider, baseUrl, miniBlockHash, timeout, size }),

    getMiniBlockTransactionsCount: ({ miniBlockHash }: { miniBlockHash: string }) =>
      f.getMiniBlockTransactionsCount({ provider, miniBlockHash, timeout, baseUrl }),

    /* Transactions */

    getTransactions: ({ size, addressId, shardId, shardType }: f.TransactionsType) =>
      f.getTransactions({ provider, baseUrl, timeout, addressId, size, shardId, shardType }),

    getTransactionsCount: ({ size, addressId, shardId, shardType }: f.TransactionsType) =>
      f.getTransactionsCount({
        provider,
        baseUrl,
        timeout,
        addressId,
        size,
        shardId,
        shardType,
      }),

    getAddressDetails: ({ addressId }: { addressId: string }) =>
      f.getAddressDetails({ proxyUrl, timeout, addressId }),

    getRewards: ({ addressId }: { addressId: string }) =>
      f.getRewards({ proxyUrl, timeout, addressId }),

    /* Validators */

    getRounds: ({ shardNumber, signersIndex, epoch, roundAtEpochStart }: f.GetRoundsType) =>
      f.getRounds({
        provider,
        baseUrl,
        shardNumber,
        signersIndex,
        epoch,
        timeout: Math.max(timeout, 10000),
        roundAtEpochStart,
      }),

    getValidator: ({ currentValidator, explorerApi, publicKey }: f.GetValidatorType) =>
      f.getValidator({
        provider,
        currentValidator,
        proxyUrl,
        baseUrl,
        timeout: Math.max(timeout, 10000),
        explorerApi,
        publicKey,
      }),

    searchBlocks: ({ shardNumber, signersIndex, epoch, roundAtEpochStart }: f.GetRoundsType) =>
      f.searchBlocks({
        provider,
        baseUrl,
        shardNumber,
        signersIndex,
        epoch,
        timeout: Math.max(timeout, 10000),
        roundAtEpochStart,
      }),

    /* Search */

    isBlock: ({ hash }: { hash: string }) => f.isBlock({ provider, baseUrl, hash, timeout }),

    isAddress: ({ hash }: { hash: string }) => f.isAddress({ proxyUrl, hash, timeout }),

    isTransaction: ({ hash }: { hash: string }) =>
      f.isTransaction({ provider, baseUrl, proxyUrl, hash, timeout }),
  };
}
