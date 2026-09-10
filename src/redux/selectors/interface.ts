import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.interface;
};

export const interfaceSelector = stateSelector;

export const explorerOriginSelector = createSelector(
  stateSelector,
  (state) => state.explorerOrigin
);

export const activeThemeSelector = createSelector(
  stateSelector,
  (state) => state.activeTheme
);

export const notificationsSelector = createSelector(
  stateSelector,
  (state) => state.notifications
);

export const highlightedTextSelector = createSelector(
  stateSelector,
  (state) => state.highlightedText
);
