import { AxiosResponse } from 'axios';
import getHighlights from './getHighlights';
import getLatestBlocks from './getLatestBlocks';
import getNodes, { GetNodesType as GetNodesInterface } from './getNodes';
import getLatestTransactions from './getLatestTransactions';
import { getBlocks, GetBlocksParamsType, getBlocksCount } from './getBlocks';
import getBlock, { BlockType as BlockInterface } from './getBlock';
import {
  getTransactions,
  getTransactionsCount,
  getAddressDetails,
  getRewards,
  TransactionsType as TransactionsInterface,
} from './getTransactions';
import { getTransaction } from './getTransaction';
import {
  getMiniBlock,
  getMiniBlockTransactions,
  getMiniBlockTransactionsCount,
} from './getMiniBlocks';
import {
  getRounds,
  GetRoundsType as RoundsType,
  searchBlocks,
  getValidator,
  GetValidatorType as GetValidatorInterface,
} from './getValidators';
import { isBlock, isAddress, isTransaction } from './getSearch';

export interface ProviderPropsType {
  baseUrl: string;
  params?: {
    nonce?: number;
    shardId?: number;
    epoch?: number;
    proposer?: number;
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
    shard?: string;
    status?: string;
  };
  timeout: number;
}

export type ProviderType = (props: ProviderPropsType & { url: string }) => Promise<AxiosResponse>;

export type AdapterFunctionType = ProviderPropsType & { provider: ProviderType };

export type GetBlocksType = GetBlocksParamsType;

export type TransactionsType = TransactionsInterface;

export type GetRoundsType = RoundsType;

export type BlockType = BlockInterface;

export type GetValidatorType = GetValidatorInterface;

export type GetNodesType = GetNodesInterface;

export {
  getHighlights,
  getLatestBlocks,
  getLatestTransactions,
  getBlock,
  getBlocks,
  getBlocksCount,
  getTransaction,
  getMiniBlock,
  getMiniBlockTransactions,
  getMiniBlockTransactionsCount,
  getTransactions,
  getTransactionsCount,
  getAddressDetails,
  getRewards,
  isBlock,
  isAddress,
  isTransaction,
  getRounds,
  searchBlocks,
  getValidator,
  getNodes,
};
