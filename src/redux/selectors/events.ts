import { createSelector } from 'reselect';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.events;
};

export const eventsSelector = createSelector(stateSelector, (state) => state);
