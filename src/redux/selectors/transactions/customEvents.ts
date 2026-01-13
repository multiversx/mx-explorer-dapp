import { createSelector } from 'reselect';
import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.customEvents;
};

export const customEventsSelector = createSelector(
  stateSelector,
  (state) => state
);
