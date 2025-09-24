import { NetworkConfigType } from 'lib';
import { NetworkAdapterEnum } from './adapter.types';

export interface NetworkType extends Partial<NetworkConfigType> {
  adapter: NetworkAdapterEnum | string; // temporary, will be restricted on a future network adapter overhaul
  hrp?: string;
  refreshRate?: number;
  theme?: string;
  default?: boolean;
  accessToken?: boolean;
  extrasApi?: string;
  growthApi?: string;
  elasticUrl?: string;
  proxyUrl?: string;
  updatesWebsocketUrl?: string;
  nftExplorerAddress?: string;
  hasExchangeData?: boolean;
  hasWebsocketConfig?: boolean;
  isSovereign?: boolean;
  isCustom?: boolean;
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
  refreshRate?: number;
}
