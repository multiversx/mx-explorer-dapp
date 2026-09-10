import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.metaTags;
};

export const metaTagsSelector = stateSelector;
