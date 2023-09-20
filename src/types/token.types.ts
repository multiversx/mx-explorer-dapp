import { RolesType, SliceType, AccountAssetType } from 'types';

export interface TokenType {
  type: TokenTypeEnum;
  identifier: string;
  ticker?: string;
  name: string;
  balance?: string;
  decimals?: number;
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
  price?: number;
  marketCap?: number;
  valueUsd?: number;
  assets?: TokenAssetType;
  roles?: TokenRolesType[];
}

export interface TokenSliceType extends SliceType {
  token: TokenType;
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
}
