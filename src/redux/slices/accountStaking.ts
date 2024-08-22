import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ELLIPSIS } from 'appConstants';
import { AccountStakingSliceType } from 'types/account.types';

export const getInitialAccountStakingState = (): AccountStakingSliceType => {
  return {
    address: '',

    showDelegation: false,
    showLegacyDelegation: false,
    showValidatorStake: false,
    showStakingDetails: false,

    activeValidatorStake: ELLIPSIS,
    activeDelegation: ELLIPSIS,
    activeLegacyDelegation: ELLIPSIS,

    lockedValidatorStake: ELLIPSIS,
    lockedDelegation: ELLIPSIS,
    lockedLegacyDelegation: ELLIPSIS,

    totalActiveStake: ELLIPSIS,
    totalLocked: ELLIPSIS,
    totalClaimable: ELLIPSIS,
    totalUnstaked: ELLIPSIS,

    providerDataReady: undefined,
    delegationProviders: [],
    delegationLegacyIdentity: undefined,

    accountStakingFetched: false
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
      state.address = action.payload.address;

      state.showDelegation = action.payload.showDelegation;
      state.showLegacyDelegation = action.payload.showLegacyDelegation;
      state.showValidatorStake = action.payload.showValidatorStake;
      state.showStakingDetails = action.payload.showStakingDetails;

      state.activeValidatorStake = action.payload.activeValidatorStake;
      state.activeDelegation = action.payload.activeDelegation;
      state.activeLegacyDelegation = action.payload.activeLegacyDelegation;

      state.lockedValidatorStake = action.payload.lockedValidatorStake;
      state.lockedDelegation = action.payload.lockedDelegation;
      state.lockedLegacyDelegation = action.payload.lockedLegacyDelegation;

      state.totalActiveStake = action.payload.totalActiveStake;
      state.totalLocked = action.payload.totalLocked;
      state.totalClaimable = action.payload.totalClaimable;
      state.totalUnstaked = action.payload.totalUnstaked;

      state.stake = action.payload.stake;
      state.legacyDelegation = action.payload.legacyDelegation;
      state.delegation = action.payload.delegation;

      state.providerDataReady = action.payload.providerDataReady;
      state.delegationProviders = action.payload.delegationProviders;
      state.delegationLegacyIdentity = action.payload.delegationLegacyIdentity;

      state.accountStakingFetched = action.payload.accountStakingFetched;
    }
  }
});

export const { setAccountStaking } = accountStakingSlice.actions;

export const accountStakingReducer = accountStakingSlice.reducer;
