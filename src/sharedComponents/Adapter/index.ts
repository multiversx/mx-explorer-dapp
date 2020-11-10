import { useGlobalState } from 'context';
import elastic from './elastic';
import api from './api';
import * as f from './functions';
import { metaChainShardId } from 'appConfig';

export default function useAdapter() {
  const {
    activeNetwork: { elasticUrl, adapter, proxyUrl: nodeUrl, apiUrl },
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

    getMiniBlock: (miniBlockHash: string) =>
      f.getMiniBlock({ provider, baseUrl, miniBlockHash, timeout }),

    getMiniBlockTransactions: ({ miniBlockHash, size }: { miniBlockHash: string; size: number }) =>
      f.getMiniBlockTransactions({ provider, baseUrl, miniBlockHash, timeout, size }),

    getMiniBlockTransactionsCount: ({ miniBlockHash }: { miniBlockHash: string }) =>
      f.getMiniBlockTransactionsCount({ provider, miniBlockHash, timeout, baseUrl }),

    /* Transactions */

    getTransactions: ({ size, addressId, senderShard, receiverShard }: f.TransactionsType) =>
      f.getTransactions({
        provider,
        baseUrl,
        timeout,
        addressId,
        size,
        senderShard,
        receiverShard,
      }),

    getTransactionsCount: ({ size, addressId, senderShard, receiverShard }: f.TransactionsType) =>
      f.getTransactionsCount({
        provider,
        baseUrl,
        timeout,
        addressId,
        size,
        senderShard,
        receiverShard,
      }),

    getAddressDetails: ({ addressId }: { addressId: string }) =>
      f.getAddressDetails({ proxyUrl, timeout, addressId }),

    getRewards: ({ addressId }: { addressId: string }) =>
      f.getRewards({ proxyUrl, timeout, addressId }),

    /* Validators */

    getShards: () =>
      f.getShards({
        provider,
        baseUrl,
        timeout,
      }),

    getNodes: ({
      peerType,
      issues,
      search,
      nodeType,
      shardId,
      status,
      size,
      identity,
      pagination,
    }: f.GetNodesType) =>
      f.getNodes({
        provider,
        baseUrl,
        timeout,
        peerType,
        issues,
        search,
        nodeType,
        shardId,
        status,
        size,
        identity,
        pagination,
      }),

    getNodesCount: ({
      peerType,
      issues,
      search,
      nodeType,
      shardId,
      status,
      identity,
    }: f.GetNodesType) =>
      f.getNodes({
        provider,
        baseUrl,
        timeout,
        peerType,
        issues,
        search,
        nodeType,
        shardId,
        status,
        identity,
        count: true,
      }),

    getIdentities: () =>
      f.getIdentities({
        provider,
        baseUrl,
        timeout,
      }),

    getIdentity: (identity: string) =>
      f.getIdentity({
        provider,
        baseUrl,
        timeout,
        identity,
      }),

    getNode: (key: string) =>
      f.getNode({
        provider,
        baseUrl,
        timeout,
        key,
      }),

    getNodeRounds: (key: string) =>
      f.getNodeRounds({
        provider,
        baseUrl,
        key,
        timeout,
      }),

    getNodeBlocks: (key: string) =>
      f.getNodeBlocks({
        provider,
        baseUrl,
        key,
        timeout,
      }),

    getHistoricRatings: (key: string) =>
      f.getHistoricRatings({
        provider,
        baseUrl,
        key,
        timeout,
      }),

    /* Search */

    isBlock: (hash: string) => f.isBlock({ provider, baseUrl, hash, timeout }),

    isAddress: (hash: string) => f.isAddress({ proxyUrl, hash, timeout }),

    isTransaction: (hash: string) =>
      f.isTransaction({ provider, baseUrl, proxyUrl, hash, timeout }),

    isNode: (hash: string) => f.getNode({ provider, baseUrl, key: hash, timeout }),

    isMiniBlock: ({ hash }: { hash: string }) =>
      f.getMiniBlock({ provider, baseUrl, miniBlockHash: hash, timeout }),
  };
}
