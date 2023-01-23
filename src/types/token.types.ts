import { RolesType } from './legacyTypes.types';

export interface TokenType {
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
  canBurn: boolean;
  canChangeOwner: boolean;
  canFreeze: boolean;
  canMint: boolean;
  canPause: boolean;
  canUpgrade: boolean;
  canWipe: boolean;
  isPaused: boolean;
  transactions: number;
  accounts: number;
  price?: number;
  marketCap?: number;
  valueUsd?: number;
  assets?: {
    website?: string;
    description?: string;
    status?: string;
    pngUrl?: string;
    svgUrl?: string;
    social?: any;
    extraTokens?: string[];
    lockedAccounts?: { [key: string]: string };
  };
  roles?: TokenRolesType[];
}

export interface TokenSliceType extends TokenType {
  tokenFetched: boolean;
}

export interface TokenRolesType extends RolesType {
  canLocalMint: boolean;
  canLocalBurn: boolean;
}

export interface TokenLockedAccountType {
  address: string;
  name: string;
  balance: string;
}

export interface TokenSupplyType {
  supply: number;
  circulatingSupply: number;
  minted: number;
  burnt: number;
  initialMinted: number;
  lockedAccounts?: TokenLockedAccountType[];
}
