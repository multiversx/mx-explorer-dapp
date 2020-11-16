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

    getNetworkStatus: () => f.getNetworkStatus({ proxyUrl, timeout, metaChainShardId }),

    getLatestBlocks: () => f.getLatestBlocks({ provider, baseUrl, timeout }),

    getLatestTransactions: () => f.getLatestTransactions({ provider, baseUrl, timeout }),

    /* Blocks */

    getBlock: (blockId: string) => f.getBlock({ provider, baseUrl, blockId, timeout }),

    getBlocks: ({ size, shard, epochId, proposer }: f.GetBlocksType) =>
      f.getBlocks({ provider, baseUrl, size, shard, epochId, proposer, timeout }),

    getBlocksCount: ({ size, shard, epochId }: f.GetBlocksType) =>
      f.getBlocksCount({ provider, baseUrl, size, shard, epochId, timeout }),

    /* Transaction */

    getTransaction: (transactionId: string) =>
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

    getAddressDetails: (addressId: string) => f.getAddressDetails({ proxyUrl, timeout, addressId }),

    getRewards: (addressId: string) => f.getRewards({ proxyUrl, timeout, addressId }),

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
      shard,
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
        shard,
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
      shard,
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
        shard,
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

    getRounds: ({ validator }: f.GetRoundsType) =>
      f.getRounds({
        provider,
        baseUrl,
        validator,
        timeout,
      }),
  };
}
