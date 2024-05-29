import { NetworkType as NetworkConfigType } from '@multiversx/sdk-dapp/types/network.types';

export interface NetworkType extends Partial<NetworkConfigType> {
  adapter: 'api' | 'elastic';
  theme?: string;
  default?: boolean;
  accessToken?: boolean;
  extrasApi?: string;
  growthApi?: string;
  elasticUrl?: string;
  proxyUrl?: string;
  nftExplorerAddress?: string;
  isSovereign?: boolean;
}

export interface NetworkUrlType {
  id: string;
  name: string;
  url: string;
}
