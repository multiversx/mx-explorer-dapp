import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.blocks;
};

export const blocksSelector = stateSelector;
