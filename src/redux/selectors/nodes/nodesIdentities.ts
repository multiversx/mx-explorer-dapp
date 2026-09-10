import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.nodesIdentities;
};

export const nodesIdentitiesSelector = stateSelector;
