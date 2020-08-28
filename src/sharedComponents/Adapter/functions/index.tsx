import { AxiosResponse } from 'axios';
import getHighlights from './getHighlights';
import getLatestBlocks from './getLatestBlocks';
import getLatestTransactions from './getLatestTransactions';
import { getBlocks, GetBlocksParamsType, getBlocksCount } from './getBlocks';
import getBlock from './getBlock';
import {
  getTransactions,
  getTransactionsCount,
  getAddressDetails,
  getRewards,
  TransactionsType as TransactionsInterface,
} from './getTransactions';
import { getTransaction, getPendingTransaction } from './getTransaction';
import {
  getMiniBlock,
  getMiniBlockTransactions,
  getMiniBlockTransactionsCount,
} from './getMiniBlocks';
import { isBlock, isAddress, isTransaction } from './getSearch';

interface ProviderPropsType {
  elasticUrl: string;
  params?: object;
  timeout: number;
}

export type ProviderType = (props: ProviderPropsType & { url: string }) => Promise<AxiosResponse>;

export type AdapterFunctionType = ProviderPropsType & { provider: ProviderType };

export type GetBlocksType = GetBlocksParamsType;

export type TransactionsType = TransactionsInterface;

export {
  getHighlights,
  getLatestBlocks,
  getLatestTransactions,
  getBlock,
  getBlocks,
  getBlocksCount,
  getTransaction,
  getPendingTransaction,
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
};
