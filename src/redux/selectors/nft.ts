import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.nft;
};

export const nftSelector = createSelector(stateSelector, (state) => state);
