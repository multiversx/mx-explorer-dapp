import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.nft;
};

export const nftSelector = stateSelector;
