import { useGlobalState } from 'context';
import elasticAdapter from './elastic';
import apiAdapter from './api';
import * as f from './functions';
import { metaChainShardId } from 'appConfig';

export default function useAdapter() {
  const {
    activeNetwork: { elasticUrl, adapter, proxyUrl: nodeUrl, apiUrl },
    timeout,
  } = useGlobalState();

  const providers = {
    api: {
      baseUrl: apiUrl || '',
      proxyUrl: apiUrl || '',
      ...apiAdapter,
    },
    elastic: {
      baseUrl: elasticUrl || '',
      proxyUrl: nodeUrl || '',
      ...elasticAdapter,
    },
  };

  const { provider, proxyUrl, baseUrl, getStats } = providers[adapter];

  return {
    /* Homepage */

    getStats: () => {
      const asyncRequest = () =>
        getStats({
          proxyUrl,
          baseUrl,
          metaChainShardId,
          timeout,
        });
      return f.getStats(asyncRequest);
    },

    // getHighlights: () =>
    //   f.getStats({ provider: getStats, proxyUrl, baseUrl, timeout, metaChainShardId }),

    getNetworkStatus: () => f.getNetworkStatus({ proxyUrl, timeout, metaChainShardId }),

    getLatestBlocks: () => f.getLatestBlocks({ provider, baseUrl, timeout, proxyUrl }),

    getLatestTransactions: () => f.getLatestTransactions({ provider, baseUrl, timeout, proxyUrl }),

    /* Blocks */

    getBlock: (blockId: string) => f.getBlock({ provider, baseUrl, blockId, proxyUrl, timeout }),

    getBlocks: ({ size, shard, epochId, proposer }: f.GetBlocksType) =>
      f.getBlocks({ provider, baseUrl, size, shard, epochId, proposer, timeout, proxyUrl }),

    getBlocksCount: ({ size, shard, epochId }: f.GetBlocksType) =>
      f.getBlocksCount({ provider, baseUrl, size, shard, epochId, proxyUrl, timeout }),

    /* Transaction */

    getTransaction: (transactionId: string) =>
      f.getTransaction({ provider, baseUrl, transactionId, proxyUrl, timeout }),

    /* Miniblocks */

    getMiniBlock: (miniBlockHash: string) =>
      f.getMiniBlock({ provider, baseUrl, miniBlockHash, proxyUrl, timeout }),

    getMiniBlockTransactions: ({ miniBlockHash, size }: { miniBlockHash: string; size: number }) =>
      f.getMiniBlockTransactions({ provider, baseUrl, miniBlockHash, timeout, proxyUrl, size }),

    getMiniBlockTransactionsCount: ({ miniBlockHash }: { miniBlockHash: string }) =>
      f.getMiniBlockTransactionsCount({ provider, miniBlockHash, timeout, proxyUrl, baseUrl }),

    /* Transactions */

    getTransactions: ({ size, address, senderShard, receiverShard }: f.TransactionsType) =>
      f.getTransactions({
        provider,
        baseUrl,
        timeout,
        address,
        size,
        senderShard,
        receiverShard,
      }),

    getTransactionsCount: ({ size, address, senderShard, receiverShard }: f.TransactionsType) =>
      f.getTransactionsCount({
        provider,
        baseUrl,
        timeout,
        address,
        size,
        senderShard,
        receiverShard,
      }),

    getRewards: (address: string) => f.getRewards({ proxyUrl, timeout, address }),

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
      sort,
      order,
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
        sort,
        order,
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

    getAccount: (address: string) => f.getAccount({ proxyUrl, timeout, address }),

    getAccounts: ({ size }: f.GetAccountsType) =>
      f.getAccounts({ provider, baseUrl, size, timeout }),

    getAccountsCount: ({ size }: f.GetAccountsType) =>
      f.getAccountsCount({ provider, baseUrl, size, timeout }),
  };
}
