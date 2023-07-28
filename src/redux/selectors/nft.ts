import { createSelector } from 'reselect';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.nft;
};

export const nftSelector = createSelector(stateSelector, (state) => state);
