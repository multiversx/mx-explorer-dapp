import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.pageHeadersBlocksStats;
};

export const pageHeadersBlocksStatsSelector = stateSelector;
