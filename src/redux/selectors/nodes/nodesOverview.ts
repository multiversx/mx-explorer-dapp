import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.nodesOverview;
};

export const nodesOverviewSelector = stateSelector;
