import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.collection;
};

export const collectionSelector = stateSelector;
