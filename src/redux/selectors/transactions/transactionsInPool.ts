import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.transactionsInPool;
};

export const transactionsInPoolSelector = stateSelector;
