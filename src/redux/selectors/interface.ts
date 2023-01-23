import { createSelector } from 'reselect';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.interface;
};

export const interfaceSelector = createSelector(
  stateSelector,
  (state) => state
);

export const explorerOriginSelector = createSelector(
  stateSelector,
  (state) => state.explorerOrigin
);

export const activeThemeSelector = createSelector(
  stateSelector,
  (state) => state.activeTheme
);
