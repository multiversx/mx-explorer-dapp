import { createSelector } from 'reselect';
import { RootState } from '../store';

const stateSelector = (state: RootState) => state.networks;

export const networksSelector = createSelector(stateSelector, (state) => state);
export const activeNetworkSelector = createSelector(stateSelector, (state) => {
  return state.activeNetwork;
});

export const defaultNetworkSelector = createSelector(stateSelector, (state) => {
  return state.defaultNetwork;
});

export const egldLabelSelector = createSelector(
  stateSelector,
  (state) => state.activeNetwork.egldLabel
);
