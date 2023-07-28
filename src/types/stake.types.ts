export interface UndelegationType {
  amount: string;
  seconds: number;
}

export interface DelegationType {
  address: string;
  contract: string;
  userUnBondable: string;
  userActiveStake: string;
  claimableRewards: string;
  userUndelegatedList?: UndelegationType[];
}
export interface DelegationLegacyType {
  userActiveStake?: string;
  userDeferredPaymentStake?: string;
  userUnstakedStake?: string;
  userWaitingStake?: string;
  userWithdrawOnlyStake?: string;
  claimableRewards?: string;
}

export interface StakeType {
  totalStaked?: string;
  unstakedTokens?: { amount: string; expires?: number }[];
}
