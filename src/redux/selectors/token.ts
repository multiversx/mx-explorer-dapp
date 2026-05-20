import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.token;
};

export const tokenSelector = createSelector(stateSelector, (state) => state);
