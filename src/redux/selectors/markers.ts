import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.markers;
};

export const markersSelector = createSelector(stateSelector, (state) => state);
