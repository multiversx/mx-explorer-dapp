import getStats from './getStats';
import getLatestBlocks from './getLatestBlocks';
import getShards from './getShards';
import getIdentities from './getIdentities';
import getIdentity from './getIdentity';
import getNode from './getNode';
import getRounds, { GetRoundsType as GetRoundsInterface } from './getRounds';
import getNodes, { GetNodesType as GetNodesInterface } from './getNodes';
import getLatestTransactions from './getLatestTransactions';
import { getBlocks, GetBlocksParamsType, getBlocksCount } from './getBlocks';
import { getAccounts, getAccountsCount, GetAccountsParamsType } from './getAccounts';
import getBlock from './getBlock';
import getNetworkStatus from './getNetworkStatus';
import {
  getTransactions,
  getTransactionsCount,
  getAccount,
  getRewards,
  TransactionsType as TransactionsInterface,
} from './getTransactions';
import { getTransaction } from './getTransaction';
import {
  getMiniBlock,
  getMiniBlockTransactions,
  getMiniBlockTransactionsCount,
} from './getMiniBlocks';

export interface ProviderPropsType {
  baseUrl: string;
  proxyUrl?: string;
  metaChainShardId?: number;
  url?: string;
  params?: {
    nonce?: number;
    shard?: number;
    epoch?: number;
    proposer?: string;
    miniBlockHash?: string;
    sender?: string;
    receiver?: string;
    condition?: 'should' | 'must';
    senderShard?: number;
    receiverShard?: number;
    signersIndexes?: number;
    round?: number;
    from?: number;
    size?: number;
    search?: string;
    issues?: string;
    peerType?: string;
    nodeType?: string;
    status?: string;
    validator?: string;
    fields?: any;
    identity?: string;
    sort?: string;
    order?: string;
  };
  timeout: number;
}

// export type ProviderType = (props: ProviderPropsType & { url: string }) => Promise<AxiosResponse>;
export type ProviderType = (props: ProviderPropsType & { url: string }) => Promise<any>; // TODO: back

export type AdapterFunctionType = ProviderPropsType & { provider: ProviderType };

export type GetBlocksType = GetBlocksParamsType;

export type TransactionsType = TransactionsInterface;

export type GetNodesType = GetNodesInterface;

export type GetRoundsType = GetRoundsInterface;

export type GetAccountsType = GetAccountsParamsType;

export {
  getLatestBlocks,
  getLatestTransactions,
  getBlock,
  getBlocks,
  getBlocksCount,
  getTransaction,
  getTransactions,
  getTransactionsCount,
  getMiniBlock,
  getMiniBlockTransactions,
  getMiniBlockTransactionsCount,
  getRewards,
  getRounds,
  getNode,
  getNodes,
  getShards,
  getIdentity,
  getIdentities,
  getNetworkStatus,
  getAccount,
  getAccounts,
  getAccountsCount,
  getStats,
};
