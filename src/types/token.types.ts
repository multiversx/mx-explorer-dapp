import {
  RolesType,
  SliceType,
  AccountAssetType,
  NftSubtypeEnum,
  GrowthChartDataType
} from 'types';

export interface TokenType {
  type: TokenTypeEnum;
  subType?: NftSubtypeEnum;
  identifier: string;
  ticker?: string;
  name: string;
  balance?: string;
  decimals?: number;
  hash?: string;
  owner: string;
  minted: string;
  burnt: string;
  supply: string | number;
  circulatingSupply: string | number;
  canBurn?: boolean;
  canChangeOwner?: boolean;
  canFreeze?: boolean;
  canMint?: boolean;
  canPause?: boolean;
  canUpgrade?: boolean;
  canWipe?: boolean;
  isPaused?: boolean;
  transactions: number;
  accounts: number;
  transfers?: number;
  price?: number;
  marketCap?: number;
  valueUsd?: number;
  assets?: TokenAssetType;
  totalLiquidity?: number;
  isLowLiquidity?: boolean;
  lowLiquidityThresholdPercent?: number;
  roles?: TokenRolesType[];
}

export interface TokenSliceType extends SliceType {
  token: TokenType;
}

export interface TokenExtraSliceType extends SliceType {
  tokenExtra: {
    identifier: string;
    priceHistory: GrowthChartDataType[];
  };
}

export enum TokenTypeEnum {
  FungibleESDT = 'FungibleESDT',
  MetaESDT = 'MetaESDT'
}

export enum TokenSortEnum {
  price = 'price',
  marketCap = 'marketCap',
  accounts = 'accounts',
  transactions = 'transactions'
}

export interface TokenRolesType extends RolesType {
  canLocalMint: boolean;
  canLocalBurn: boolean;
}

export interface TokenLockedAccountType {
  address: string;
  name: string;
  balance: string;
  assets?: AccountAssetType;
}

export interface TokenSupplyType {
  supply: number;
  circulatingSupply: number;
  minted: number;
  burnt: number;
  initialMinted: number;
  lockedAccounts?: TokenLockedAccountType[];
}

export enum TokenAssetsPriceSourceTypeEnum {
  dataApi = 'dataApi',
  customUrl = 'customUrl'
}

export interface TokenAssetPriceSourceType {
  type?: TokenAssetsPriceSourceTypeEnum;
  url?: string;
  path?: string;
}

export interface TokenAssetType {
  name?: string;
  website?: string;
  description?: string;
  status?: string;
  pngUrl?: string;
  svgUrl?: string;
  social?: { [key: string]: string };
  extraTokens?: string[];
  lockedAccounts?: { [key: string]: string };
  priceSource?: TokenAssetPriceSourceType;
}
