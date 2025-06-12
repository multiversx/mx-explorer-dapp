import { NetworkType as NetworkConfigType } from '@multiversx/sdk-dapp/types/network.types';
import { NetworkAdapterEnum } from './adapter.types';

export interface NetworkType extends Partial<NetworkConfigType> {
  adapter: NetworkAdapterEnum | string; // temporary, will be restricted on a future network adapter overhaul
  hrp?: string;
  theme?: string;
  default?: boolean;
  accessToken?: boolean;
  extrasApi?: string;
  growthApi?: string;
  elasticUrl?: string;
  proxyUrl?: string;
  nftExplorerAddress?: string;
  isSovereign?: boolean;
  isCustom?: boolean;
  hasProofsEndpoint?: boolean;
}

export interface NetworkUrlType {
  id: string;
  name: string;
  url: string;
}

export interface DappNetworkConfigType {
  id: string | number;
  name: string;
  egldLabel: string;
  decimals: string;
  egldDenomination: string;
  gasPerDataByte: string;
  apiTimeout: string;
  walletConnectDeepLink: string;
  walletConnectBridgeAddresses: string[];
  walletAddress: string;
  apiAddress: string;
  explorerAddress: string;
  chainId: string;
}
