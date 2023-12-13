import { AccountAssetType } from 'types';

export interface GrowthMostUsedType {
  dailyMostUsedApplications: MostUsedApplicationsType[];
  dailyMostTransactedNFTs: MostUsedCollectionsType[];
  dailyMostTransactedTokens: MostUsedTokensType[];
}

export interface GrowthMostUsedSliceType extends GrowthMostUsedType {
  isFetched: boolean;
}

export interface MostUsedBaseType {
  rank: number;
  key: string;
  value: number;
}

export interface MostUsedApplicationsType extends MostUsedBaseType {
  extraInfo?: {
    assets?: AccountAssetType;
  };
}

export interface MostUsedTokensType extends MostUsedBaseType {
  extraInfo?: {
    name?: string;
    ticker?: string;
    assets?: AccountAssetType;
  };
}

export interface MostUsedCollectionsType extends MostUsedBaseType {
  extraInfo?: {
    name?: string;
    ticker?: string;
    assets?: AccountAssetType;
  };
}
