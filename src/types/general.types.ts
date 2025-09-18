import { AccountAssetType, IdentityType } from 'types';

export enum NetworkIdEnum {
  mainnet = 'mainnet',
  testnet = 'testnet',
  devnet = 'devnet'
}

export enum SortOrderEnum {
  asc = 'asc',
  desc = 'desc'
}

export interface ScamInfoType {
  type: string;
  info: string;
}

export interface RolesType {
  address: string;
  assets?: AccountAssetType;
  roles: string[];
}

export interface SliceType {
  isFetched?: boolean;
}

export enum TrendEnum {
  up = 'up',
  down = 'down',
  neutral = 'neutral'
}
