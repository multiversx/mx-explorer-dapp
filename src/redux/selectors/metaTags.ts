import { createSelector } from 'reselect';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.metaTags;
};

export const metaTagsSelector = createSelector(stateSelector, (state) => state);
