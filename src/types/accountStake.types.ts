export interface AccountUndelegationType {
  amount: string;
  seconds: number;
}

export interface AccountDelegationType {
  address: string;
  contract: string;
  userUnBondable: string;
  userActiveStake: string;
  claimableRewards: string;
  userUndelegatedList?: AccountUndelegationType[];
}
export interface AccountDelegationLegacyType {
  userActiveStake?: string;
  userDeferredPaymentStake?: string;
  userUnstakedStake?: string;
  userWaitingStake?: string;
  userWithdrawOnlyStake?: string;
  claimableRewards?: string;
}

export interface AccountStakeType {
  totalStaked?: string;
  unstakedTokens?: { amount: string; expires?: number }[];
}
