import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { networks } from 'config';
import { NetworkType } from 'types/network.types';

export const emptyNetwork: NetworkType = {
  default: false,
  id: 'not-configured',
  name: 'NOT CONFIGURED',
  adapter: 'api',
  theme: '',
  egldLabel: '',
  walletAddress: '',
  explorerAddress: '',
  apiAddress: '',
  accessToken: false
};

type CurrentNetworkSliceType = {
  defaultNetwork: NetworkType;
  activeNetwork: NetworkType;
};

export const getInitialState = (): CurrentNetworkSliceType => {
  const defaultNetwork =
    networks.find(({ default: active }) => Boolean(active)) ?? emptyNetwork;

  return {
    defaultNetwork,
    activeNetwork: defaultNetwork
  };
};

export const networksSlice = createSlice({
  name: 'networksSlice',
  initialState: getInitialState(),
  reducers: {
    changeNetwork: (
      state: CurrentNetworkSliceType,
      action: PayloadAction<NetworkType>
    ) => {
      state.activeNetwork = {
        ...action.payload
      };
    }
  }
});

export const { changeNetwork } = networksSlice.actions;
export const networkReducer = networksSlice.reducer;
