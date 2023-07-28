import { createSelector } from 'reselect';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.markers;
};

export const markersSelector = createSelector(stateSelector, (state) => state);
