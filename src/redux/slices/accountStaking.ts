import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccountStakingSliceType } from 'types/account.types';

export const getInitialAccountStakingState = (): AccountStakingSliceType => {
  return {
    showDelegation: false,
    showDelegationLegacy: false,
    showStake: false,
    totalStaked: '0',
    totalDelegation: '0',
    totalLegacyDelegation: '0',
    totalLocked: '0',
    totalClaimable: '0',
    providerDataReady: undefined,
    stakingDataReady: undefined,
    delegationProviders: [],
    delegationLegacyIdentity: undefined,

    accountStakingFetched: false,
  };
};

export const accountStakingSlice = createSlice({
  name: 'accountStakingSlice',
  initialState: getInitialAccountStakingState(),
  reducers: {
    setAccountStaking: (
      state: AccountStakingSliceType,
      action: PayloadAction<AccountStakingSliceType>
    ) => {
      state.totalStaked = action.payload.totalStaked;
      state.totalDelegation = action.payload.totalDelegation;
      state.totalLegacyDelegation = action.payload.totalLegacyDelegation;
      state.totalLocked = action.payload.totalLocked;
      state.totalClaimable = action.payload.totalClaimable;
      state.stake = action.payload.stake;
      state.showStake = action.payload.showStake;
      state.delegationLegacy = action.payload.delegationLegacy;
      state.showDelegationLegacy = action.payload.showDelegationLegacy;
      state.delegation = action.payload.delegation;
      state.showDelegation = action.payload.showDelegation;
      state.providerDataReady = action.payload.providerDataReady;
      state.delegationProviders = action.payload.delegationProviders;
      state.delegationLegacyIdentity = action.payload.delegationLegacyIdentity;

      state.accountStakingFetched = action.payload.accountStakingFetched;
    },
  },
});

export const { setAccountStaking } = accountStakingSlice.actions;

export const accountStakingReducer = accountStakingSlice.reducer;
