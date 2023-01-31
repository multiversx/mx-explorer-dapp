import { createSelector } from 'reselect';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.pageHeadersStats;
};

export const pageHeadersStatsSelector = createSelector(
  stateSelector,
  (state) => state
);

export const pageHeadersBlocksSelector = createSelector(
  stateSelector,
  (state) => state.blocks
);

export const pageHeadersAccountsSelector = createSelector(
  stateSelector,
  (state) => state.accounts
);

export const pageHeadersTokensSelector = createSelector(
  stateSelector,
  (state) => state.tokens
);

export const pageHeadersCollectionsSelector = createSelector(
  stateSelector,
  (state) => state.collections
);
