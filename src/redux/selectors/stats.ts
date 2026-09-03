import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.stats;
};

export const statsSelector = stateSelector;

export const statsIsDataReadySelector = createSelector(
  stateSelector,
  (state) => state.isDataReady
);

export const statsIsWebsocketSelector = createSelector(
  stateSelector,
  (state) => state.isWebsocket
);

export const statsEpochSelector = createSelector(
  stateSelector,
  (state) => state.unprocessed.epoch
);

export const statsRefreshRateSelector = createSelector(
  stateSelector,
  (state) => state.unprocessed.refreshRate
);

export const statsRoundsPerEpochSelector = createSelector(
  stateSelector,
  (state) => state.unprocessed.roundsPerEpoch
);

export const statsRoundsPassedSelector = createSelector(
  stateSelector,
  (state) => state.unprocessed.roundsPassed
);

export const statsBlocksSelector = createSelector(
  stateSelector,
  (state) => state.unprocessed.blocks
);

export const statsAccountsSelector = createSelector(
  stateSelector,
  (state) => state.unprocessed.accounts
);

export const statsTransactionsSelector = createSelector(
  stateSelector,
  (state) => state.unprocessed.transactions
);

export const statsEpochPercentageSelector = createSelector(
  stateSelector,
  (state) => state.stats.epochPercentage
);

export const statsEpochTimeRemainingSelector = createSelector(
  stateSelector,
  (state) => state.stats.epochTimeRemaining
);
