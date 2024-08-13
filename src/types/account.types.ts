import {
  ScamInfoType,
  AccountStakeType,
  AccountDelegationType,
  AccountDelegationLegacyType,
  ProviderType,
  IdentityType,
  SliceType,
  RolesType,
  TokenType,
  CollectionType
} from 'types';

export interface AccountType {
  address: string;
  balance: string;
  nonce: number;
  txCount: number;
  scrCount: number;
  claimableRewards: string;
  code?: string;
  codeHash?: string;
  shard?: number;
  ownerAddress?: string;
  developerReward?: string;
  deployedAt?: number;
  deployTxHash?: string;
  scamInfo?: ScamInfoType;
  isUpgradeable?: boolean;
  isReadable?: boolean;
  isPayable?: boolean;
  isPayableBySmartContract?: boolean;
  assets?: AccountAssetType;
  username?: string;
  isVerified?: boolean;
  isGuarded?: boolean;
  activeGuardianAddress?: string;
  activeGuardianServiceUid?: string;
  ownerAssets?: AccountAssetType;
  transfersLast24h?: number;
}

export interface AccountSliceType extends SliceType {
  account: AccountType;
}

export interface AccountStakingSliceType {
  address: string;

  showDelegation: boolean;
  showLegacyDelegation: boolean;
  showValidatorStake: boolean;
  showStakingDetails: boolean;

  activeValidatorStake: string;
  activeDelegation: string;
  activeLegacyDelegation: string;

  lockedValidatorStake: string;
  lockedDelegation: string;
  lockedLegacyDelegation: string;

  totalActiveStake: string;
  totalLocked: string;
  totalClaimable: string;
  totalUnstaked: string;

  // details
  stake?: AccountStakeType;
  legacyDelegation?: AccountDelegationLegacyType;
  delegation?: AccountDelegationType[];

  // provider details
  providerDataReady: undefined | boolean;
  delegationProviders: ProviderType[];
  delegationLegacyIdentity: IdentityType | undefined;

  accountStakingFetched: boolean;
}

export interface AccountExtraSliceType extends SliceType {
  accountExtra: {
    address: string;
    firstTransactionDate?: number;
    tokenBalance?: string;
  };
}

export interface AccountAssetType {
  name: string;
  description?: string;
  tags?: string[];
  iconPng?: string;
  iconSvg?: string;
  svgUrl?: string;
  pngUrl?: string;
  social?: { [key: string]: string };
}

export interface AccountSmartContractType {
  address: string;
  deployTxHash: string;
  timestamp: number;
  assets?: AccountAssetType;
}

export interface AccountUpgradeType {
  address: string;
  txHash: string;
  timestamp: number;
  assets?: AccountAssetType;
}

export interface AccountTokenRolesType extends TokenType {
  role?: RolesType;
}

export interface AccountCollectionRolesType extends CollectionType {
  role?: RolesType;
}

export enum AccountRolesTypeEnum {
  tokens = 'tokens',
  collections = 'collections'
}
