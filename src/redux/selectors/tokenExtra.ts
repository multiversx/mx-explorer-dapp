import { createSelector } from 'reselect';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.tokenExtra;
};

export const tokenExtraSelector = createSelector(
  stateSelector,
  (state) => state
);
