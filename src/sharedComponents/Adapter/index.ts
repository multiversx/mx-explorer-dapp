import { useGlobalState } from 'context';
import elastic from './elastic';
import api from './api';
import * as f from './functions';

export default function useAdapter() {
  const {
    activeTestnet: { elasticUrl, adapter, proxyUrl: nodeUrl, apiUrl },
    config: { metaChainShardId },
    timeout,
  } = useGlobalState();

  // TODO: ramane apiUrl un singur url ptr api
  // la elastic ramane proprietatea proxyUrl si elasticUrl

  const providers = {
    api: {
      provider: api,
      providerUrl: apiUrl || '',
      proxyUrl: apiUrl || '',
    },
    elastic: {
      provider: elastic,
      providerUrl: elasticUrl || '',
      proxyUrl: nodeUrl || '',
    },
  };

  const { provider, proxyUrl, providerUrl } = providers[adapter];

  return {
    /* Homepage */

    getHighlights: () =>
      f.getHighlights({ provider, proxyUrl, providerUrl, timeout, metaChainShardId }),

    getLatestBlocks: () => f.getLatestBlocks({ provider, providerUrl, timeout }),

    getLatestTransactions: () => f.getLatestTransactions({ provider, providerUrl, timeout }),

    /* Blocks */

    getBlock: ({ blockId }: { blockId: string }) =>
      f.getBlock({ provider, providerUrl, blockId, timeout }),

    getBlocks: ({ size, shardId, epochId }: f.GetBlocksType) =>
      f.getBlocks({ provider, providerUrl, size, shardId, epochId, timeout }),

    getBlocksCount: ({ size, shardId, epochId }: f.GetBlocksType) =>
      f.getBlocksCount({ provider, providerUrl, size, shardId, epochId, timeout }),

    /* Transaction */

    getTransaction: ({ transactionId }: { transactionId: string }) =>
      f.getTransaction({ provider, providerUrl, transactionId, timeout }),

    getPendingTransaction: ({ transactionId }: { transactionId: string }) =>
      f.getPendingTransaction({ proxyUrl, transactionId, timeout }),

    /* Miniblocks */

    getMiniBlock: ({ miniBlockHash }: { miniBlockHash: string }) =>
      f.getMiniBlock({ provider, providerUrl, miniBlockHash, timeout }),

    getMiniBlockTransactions: ({ miniBlockHash, size }: { miniBlockHash: string; size: number }) =>
      f.getMiniBlockTransactions({ provider, providerUrl, miniBlockHash, timeout, size }),

    getMiniBlockTransactionsCount: ({ miniBlockHash }: { miniBlockHash: string }) =>
      f.getMiniBlockTransactionsCount({ provider, miniBlockHash, timeout, providerUrl }),

    /* Transactions */

    getTransactions: ({ size, addressId, shardId, shardType }: f.TransactionsType) =>
      f.getTransactions({ provider, providerUrl, timeout, addressId, size, shardId, shardType }),

    getTransactionsCount: ({ size, addressId, shardId, shardType }: f.TransactionsType) =>
      f.getTransactionsCount({
        provider,
        providerUrl,
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
        providerUrl,
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
        providerUrl,
        timeout: Math.max(timeout, 10000),
        explorerApi,
        publicKey,
      }),

    searchBlocks: ({ shardNumber, signersIndex, epoch, roundAtEpochStart }: f.GetRoundsType) =>
      f.searchBlocks({
        provider,
        providerUrl,
        shardNumber,
        signersIndex,
        epoch,
        timeout: Math.max(timeout, 10000),
        roundAtEpochStart,
      }),

    /* Search */

    isBlock: ({ hash }: { hash: string }) => f.isBlock({ provider, providerUrl, hash, timeout }),

    isAddress: ({ hash }: { hash: string }) => f.isAddress({ proxyUrl, hash, timeout }),

    isTransaction: ({ hash }: { hash: string }) =>
      f.isTransaction({ provider, providerUrl, proxyUrl, hash, timeout }),
  };
}
