import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { networks } from 'config';
import {
  activeNetworkSelector,
  defaultNetworkSelector,
  activeThemeSelector
} from 'redux/selectors';
import {
  setActiveTheme,
  changeNetwork as changeStateNetwork
} from 'redux/slices';

import { ThemesEnum } from 'types';

export const useNetworkRouter = () => {
  const theme = useSelector(activeThemeSelector);
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const defaultNetwork = useSelector(defaultNetworkSelector);
  const { id: defaultNetworkId, theme: defaultNetworkTheme } = defaultNetwork;

  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const locationArray = pathname.substring(1).split('/');

  const networkId = locationArray[0];

  const allNetworkIds = networks.map((network) => network.id);

  function changeNetwork() {
    if (allNetworkIds.includes(networkId) && activeNetworkId !== networkId) {
      // if route contains a network at the beginning replace the network
      setTimeout(() => {
        const foundNetwork = networks.find(({ id }) => id === networkId);
        const networkTheme = foundNetwork?.theme;
        if (foundNetwork) {
          if (
            networkTheme &&
            networkTheme !== theme &&
            theme !== ThemesEnum.default
          ) {
            dispatch(setActiveTheme(networkTheme as ThemesEnum));
          }

          dispatch(changeStateNetwork(foundNetwork));
        }
      });
    } else if (
      (allNetworkIds.includes(networkId) && defaultNetworkId === networkId) ||
      (networkId === '' && activeNetworkId !== '')
    ) {
      // if selected testnet is the same as the default, reset the default
      if (
        defaultNetworkTheme &&
        defaultNetworkTheme !== theme &&
        theme !== ThemesEnum.default
      ) {
        dispatch(setActiveTheme(defaultNetworkTheme as ThemesEnum));
        dispatch(changeStateNetwork(defaultNetwork));
      }
    }
  }

  useEffect(changeNetwork, [networkId, activeNetworkId]);
};
