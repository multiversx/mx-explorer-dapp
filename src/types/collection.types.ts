import {
  RolesType,
  NftEnumType,
  ScamInfoType,
  SliceType
} from './general.types';

export interface CollectionType {
  collection: string;
  type: NftEnumType;
  name: string;
  ticker: string;
  timestamp: number;
  owner: string;
  canFreeze: boolean;
  canWipe: boolean;
  canPause: boolean;
  canTransferNftCreateRole: boolean;
  canChangeOwner: boolean;
  canUpgrade: boolean;
  canAddSpecialRoles: boolean;
  decimals?: number;
  assets?: {
    website?: string;
    description?: string;
    status?: string;
    pngUrl?: string;
    svgUrl?: string;
    social?: any;
  };
  scamInfo?: ScamInfoType;
  roles?: CollectionRolesType[];
  canTransfer?: boolean;
  canCreate?: boolean;
  canBurn?: boolean;
  canAddQuantity?: boolean;
  canUpdateAttributes?: boolean;
  canAddUri?: boolean;

  isVerified?: boolean;
  nftCount?: number;
  holderCount?: number;
}

export interface CollectionSliceType extends SliceType {
  collectionState: CollectionType;
}

export interface CollectionRolesType extends RolesType {
  canCreate: boolean;
  canBurn: boolean;
  canAddQuantity: boolean;
  canUpdateAttributes: boolean;
  canAddUri: boolean;
  canTransfer: boolean;
}
