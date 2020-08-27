import { AxiosResponse } from 'axios';
import getLatestBlocks from './getLatestBlocks';
import getLatestTransactions from './getLatestTransactions';
import { getBlocks, GetBlocksParamsType, getBlocksCount } from './getBlocks';
import { getTransaction, getPendingTransaction } from './getTransaction';
import {
  getMiniBlock,
  getMiniBlockTransactions,
  getMiniBlockTransactionsCount,
} from './getMiniBlocks';

interface ProviderPropsType {
  elasticUrl: string;
  params?: object;
  timeout: number;
}

export type ProviderType = (props: ProviderPropsType & { url: string }) => Promise<AxiosResponse>;

export type AdapterFunctionType = ProviderPropsType & { provider: ProviderType };

export type GetBlocksType = GetBlocksParamsType;

export {
  getLatestBlocks,
  getLatestTransactions,
  getBlocks,
  getBlocksCount,
  getTransaction,
  getPendingTransaction,
  getMiniBlock,
  getMiniBlockTransactions,
  getMiniBlockTransactionsCount,
};
