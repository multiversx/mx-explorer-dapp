export interface GrowthMostUsedType {
  dailyMostUsedApplications: MostUsedApplicationsType[];
  dailyMostTransactedNFTs: MostUsedCollectionsType[];
  dailyMostTransactedTokens: MostUsedTokensType[];
}

export interface GrowthMostUsedSliceType extends GrowthMostUsedType {
  growthMostUsedFetched: boolean;
}

export interface MostUsedBaseType {
  rank: number;
  key: string;
  value: number;
}

export interface MostUsedApplicationsType extends MostUsedBaseType {
  extraInfo?: {
    assets?: {
      name?: string;
    };
  };
}

export interface MostUsedTokensType extends MostUsedBaseType {
  extraInfo?: {
    name?: string;
    ticker?: string;
    assets?: {
      svgUrl?: string;
      pngUrl?: string;
    };
  };
}

export interface MostUsedCollectionsType extends MostUsedBaseType {
  extraInfo?: {
    name?: string;
    ticker?: string;
    assets?: {
      svgUrl?: string;
      pngUrl?: string;
    };
  };
}
