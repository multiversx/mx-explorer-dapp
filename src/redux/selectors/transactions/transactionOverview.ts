import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.transactionOverview;
};

export const transactionOverviewSelector = stateSelector;
