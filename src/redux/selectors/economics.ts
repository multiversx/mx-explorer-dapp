import { createSelector } from 'reselect';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.economics;
};

export const economicsSelector = createSelector(stateSelector, (state) => state);

export const usdPriceSelector = createSelector(stateSelector, (state) => state.price);
