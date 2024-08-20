import { RolesType, ScamInfoType, SliceType } from './general.types';
import { NftTypeEnum, NftSubtypeEnum } from './nft.types';
import { TokenAssetType } from './token.types';

export interface CollectionType {
  collection: string;
  type: NftTypeEnum;
  name: string;
  ticker: string;
  timestamp: number;
  owner: string;
  subType?: NftSubtypeEnum;
  decimals?: number;
  assets?: TokenAssetType;
  scamInfo?: ScamInfoType;
  roles?: CollectionRolesType[];
  canFreeze?: boolean;
  canWipe?: boolean;
  canPause?: boolean;
  canTransferNftCreateRole?: boolean;
  canChangeOwner?: boolean;
  canUpgrade?: boolean;
  canAddSpecialRoles?: boolean;
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
