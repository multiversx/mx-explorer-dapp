import { createSelector } from 'reselect';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.accountExtra;
};

export const accountExtraSelector = createSelector(
  stateSelector,
  (state) => state
);
