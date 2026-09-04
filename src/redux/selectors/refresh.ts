import { createSelector } from 'reselect';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.refresh;
};

export const refreshTimestampSelector = createSelector(
  stateSelector,
  (state) => state.refresh.timestamp
);

export const poolingRefreshTimestampSelector = createSelector(
  stateSelector,
  (state) => state.refresh.poolingTimestamp
);
