import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.customEvents;
};

export const customEventsSelector = stateSelector;
