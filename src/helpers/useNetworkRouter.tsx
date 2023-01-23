import React from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalDispatch, useGlobalState } from 'context';

import { useSelector } from 'react-redux';
import { activeNetworkSelector } from 'redux/selectors';

import { networks } from 'config';

export const useNetworkRouter = () => {
  const {
    defaultNetwork: { id: defaultNetworkId, theme: defaultNetworkTheme },
    theme,
  } = useGlobalState();

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const dispatch = useGlobalDispatch();
  const { pathname } = useLocation();

  const locationArray = pathname.substring(1).split('/');

  const networkId = locationArray[0];

  const allNetworkIds = networks.map((network) => network.id);

  function changeNetwork() {
    if (allNetworkIds.includes(networkId) && activeNetworkId !== networkId) {
      // if route contains a network at the beginning replace the network
      setTimeout(() => {
        const networkTheme = networks.find(({ id }) => id === networkId)?.theme;
        if (networkTheme !== theme && theme !== 'dark') {
          dispatch({
            type: 'changeTheme',
            theme: String(networkTheme),
          });
        }
        dispatch({ type: 'changeNetwork', networkId });
      });
    } else if (
      (allNetworkIds.includes(networkId) && defaultNetworkId === networkId) ||
      (networkId === '' && activeNetworkId !== '')
    ) {
      // if selected testnet is the same as the default, reset the default
      if (defaultNetworkTheme !== theme && theme !== 'dark') {
        dispatch({
          type: 'changeTheme',
          theme: String(defaultNetworkTheme),
        });
      }
      dispatch({ type: 'changeNetwork', networkId: '' });
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(changeNetwork, [networkId, activeNetworkId]);
};
