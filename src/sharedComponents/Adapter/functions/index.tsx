import { AxiosResponse } from 'axios';
import getLatestBlocks from './getLatestBlocks';
import getLatestTransactions from './getLatestTransactions';

interface ProviderPropsType {
  elasticUrl: string;
  params?: object;
  timeout: number;
}

export type ProviderType = (props: ProviderPropsType & { url: string }) => Promise<AxiosResponse>;

export type AdapterFunctionType = ProviderPropsType & { provider: ProviderType };

export { getLatestBlocks, getLatestTransactions };
