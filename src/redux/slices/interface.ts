import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExplorerOriginType, ThemesEnum } from 'types';

export type InterfaceSliceType = {
  activeTheme: ThemesEnum;
  explorerOrigin: ExplorerOriginType;
};

export function getInitialInterfaceState(): InterfaceSliceType {
  // TODO: Uncomment when multiples themes are available
  // const media = window.matchMedia('(prefers-color-scheme: dark)')?.matches;
  // const systemTheme = media ? ThemesEnum.default : ThemesEnum.default;

  // const defaultTheme = Boolean(process.env.REACT_APP_TESTNET)
  //   ? ThemesEnum.testnet
  //   : systemTheme;

  return {
    activeTheme: ThemesEnum.default,
    explorerOrigin: {
      pathname: '/',
      search: '',
    },
  };
}

export const interfaceSlice = createSlice({
  name: 'interfaceSlice',
  initialState: getInitialInterfaceState(),
  reducers: {
    setActiveTheme: (
      state: InterfaceSliceType,
      action: PayloadAction<InterfaceSliceType['activeTheme']>
    ) => {
      state.activeTheme = action.payload;
    },
    setExplorerOrigin: (
      state: InterfaceSliceType,
      action: PayloadAction<InterfaceSliceType['explorerOrigin']>
    ) => {
      state.explorerOrigin = action.payload;
    },
  },
});

export const { setActiveTheme, setExplorerOrigin } = interfaceSlice.actions;

export const interfaceReducer = interfaceSlice.reducer;
