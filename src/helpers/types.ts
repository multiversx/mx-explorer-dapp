import { IdentityType } from 'context/state';

export interface AccountType {
  address: string;
  balance: string;
  nonce: number;
  txCount: number;
  claimableRewards: string;
  code?: string;
  totalStaked?: string;
  userActiveStake?: string;
  userDeferredPaymentStake?: string;
  userUnstakedStake?: string;
  userWaitingStake?: string;
  userWithdrawOnlyStake?: string;
}

export interface TokenType {
  tokenIdentifier: string;
  tokenName: string;
  balance?: string;
  numDecimals?: number;
  ownerAddress: string;
  mintedValue: string;
  burntValue: string;
  canBurn: boolean;
  canChangeOwner: boolean;
  canFreeze: boolean;
  canMint: boolean;
  canPause: boolean;
  canUpgrade: boolean;
  canWipe: boolean;
  isPaused: boolean;
}

export interface ProviderType {
  identity?: IdentityType;
  contract: string;
  serviceFee: string;
  maxDelegationCap: string;
  apr: string;
  totalActiveStake: string;
  numUsers: number;
  numNodes: number;

  initialOwnerFunds?: string;
  automaticActivation?: boolean;
  withDelegationCap?: boolean;
  changeableServiceFee?: boolean;
  checkCapOnRedelegate?: boolean;
  createdNonce?: number;
  unBondPeriod?: number;
  totalUnStaked?: string;
  totalCumulatedRewards?: string;
  totalUnStakedFromNodes?: string;
  totalUnBondedFromNodes?: string;
  maxDelegateAmountAllowed?: string;
  maxRedelegateAmountAllowed?: string;
}
