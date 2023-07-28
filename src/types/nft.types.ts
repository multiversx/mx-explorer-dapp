import { ScamInfoType, SliceType } from './general.types';

export enum NftTypeEnum {
  NonFungibleESDT = 'NonFungibleESDT',
  SemiFungibleESDT = 'SemiFungibleESDT',
  MetaESDT = 'MetaESDT'
}
export interface NftType {
  identifier: string;
  collection: string;
  timestamp: number;
  attributes: string;
  nonce: number;
  type: NftTypeEnum;
  name: string;
  creator: string;
  royalties: number;
  balance: string;
  ticker?: string;
  uris?: string[];
  url?: string;
  thumbnailUrl?: string;
  tags?: string[];
  decimals?: number;
  owner?: string;
  supply?: string;
  isWhitelistedStorage?: boolean;
  owners?: {
    address: string;
    balance: string;
  }[];
  assets?: {
    website?: string;
    description?: string;
    status?: string;
    pngUrl?: string;
    svgUrl?: string;
  };
  metadata?: {
    description?: string;
    fileType?: string;
    fileUri?: string;
    fileName?: string;
    attributes?: { value?: string; trait_type?: string }[];
  };
  media?: {
    url: string;
    originalUrl: string;
    thumbnailUrl: string;
    fileType: string;
    fileSize: number;
  }[];
  rarities?: {
    statistical?: {
      rank?: number;
      score?: number;
    };
    trait?: {
      rank?: number;
      score?: number;
    };
    jaccardDistances?: {
      rank?: number;
      score?: number;
    };
    openRarity?: {
      rank?: number;
      score?: number;
    };
    custom?: {
      rank?: number;
      score?: number;
    };
  };
  scamInfo?: ScamInfoType;
}

export interface NftAccountType {
  address: string;
  balance: string;
}

export interface NftSliceType extends SliceType {
  nftState: NftType;
}
