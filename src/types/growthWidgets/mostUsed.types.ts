import { AccountAssetType, TokenAssetType } from 'types';

export interface GrowthMostUsedType {
  dailyMostUsedApplications: MostUsedApplicationsType[];
  dailyMostTransactedNFTs: MostUsedCollectionsType[];
  dailyMostTransactedTokens: MostUsedTokensType[];
}

export interface GrowthMostUsedSliceType extends GrowthMostUsedType {
  isDataReady: boolean;
}

export interface MostUsedBaseType {
  rank: number;
  key: string;
  value: number;
}

export interface MostUsedApplicationsType extends MostUsedBaseType {
  extraInfo?: {
    assets?: AccountAssetType;
    deployedAt?: number;
    isVerified?: boolean;
  };
}

export interface MostUsedTokensType extends MostUsedBaseType {
  extraInfo?: {
    name?: string;
    ticker?: string;
    assets?: TokenAssetType;
  };
}

export interface MostUsedCollectionsType extends MostUsedBaseType {
  extraInfo?: {
    name?: string;
    ticker?: string;
    holderCount?: number;
    nftCount?: number;
    isVerified?: boolean;
    assets?: TokenAssetType;
  };
}
