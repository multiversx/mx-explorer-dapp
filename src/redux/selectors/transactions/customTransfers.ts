import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.customTransfers;
};

export const customTransfersSelector = stateSelector;
