import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const stateSelector = (state: RootState) => state.networks;

export const networksSelector = stateSelector;
export const activeNetworkSelector = createSelector(stateSelector, (state) => {
  return state.activeNetwork;
});

export const defaultNetworkSelector = createSelector(stateSelector, (state) => {
  return state.defaultNetwork;
});

export const networkRefreshRateSelector = createSelector(
  stateSelector,
  (state) => state.activeNetwork.refreshRate
);

export const egldLabelSelector = createSelector(
  stateSelector,
  (state) => state.activeNetwork.egldLabel
);
