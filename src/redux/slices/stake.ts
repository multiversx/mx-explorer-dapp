import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ELLIPSIS } from 'appConstants';
import { StakeSliceType } from 'types/stake.types';

export const getInitialStakeState = (): StakeSliceType => {
  return {
    totalValidators: ELLIPSIS,
    activeValidators: ELLIPSIS,
    totalStaked: ELLIPSIS,

    unprocessed: {
      totalValidators: 0,
      activeValidators: 0,
      totalStaked: ELLIPSIS
    },
    isDataReady: false
  };
};

export const stakeSlice = createSlice({
  name: 'stakeSlice',
  initialState: getInitialStakeState(),
  reducers: {
    setStake: (
      state: StakeSliceType,
      action: PayloadAction<StakeSliceType>
    ) => {
      state.totalValidators = action.payload.totalValidators;
      state.activeValidators = action.payload.activeValidators;
      state.totalStaked = action.payload.totalStaked;
      state.nakamotoCoefficient = action.payload.nakamotoCoefficient;
      state.totalObservers = action.payload.totalObservers;

      state.queueSize = action.payload.queueSize;
      state.minimumAuctionQualifiedTopUp =
        action.payload.minimumAuctionQualifiedTopUp;
      state.minimumAuctionQualifiedStake =
        action.payload.minimumAuctionQualifiedStake;
      state.auctionValidators = action.payload.auctionValidators;
      state.qualifiedAuctionValidators =
        action.payload.qualifiedAuctionValidators;
      state.dangerZoneValidators = action.payload.dangerZoneValidators;
      state.eligibleValidators = action.payload.eligibleValidators;
      state.waitingValidators = action.payload.waitingValidators;
      state.allStakedNodes = action.payload.allStakedNodes;

      // not in API
      state.notQualifiedAuctionValidators =
        action.payload.notQualifiedAuctionValidators;

      state.unprocessed = action.payload.unprocessed;
      state.isDataReady = action.payload.isDataReady;
    }
  }
});

export const { setStake } = stakeSlice.actions;

export const stakeReducer = stakeSlice.reducer;
