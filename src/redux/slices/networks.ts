import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { networks } from 'config';
import { getUrlNetwork } from 'helpers';
import { NetworkAdapterEnum, NetworkType } from 'types';

export const emptyNetwork: NetworkType = {
  default: false,
  id: 'not-configured',
  name: 'NOT CONFIGURED',
  adapter: NetworkAdapterEnum.api,
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
  const urlNetwork = getUrlNetwork();
  const defaultActiveNetwork = networks.find(({ default: active }) =>
    Boolean(active)
  );

  const defaultNetworkInList = defaultActiveNetwork ?? networks[0];
  const baseNetwork = urlNetwork ?? defaultNetworkInList;
  const defaultNetwork = baseNetwork ?? emptyNetwork;

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
