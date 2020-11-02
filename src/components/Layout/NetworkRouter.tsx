import React from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalDispatch, useGlobalState } from 'context';

export default function NetworkRouter() {
  const {
    config,
    activeNetworkId,
    defaultNetwork: { id: defaultNetworkId },
  } = useGlobalState();
  const dispatch = useGlobalDispatch();
  const { pathname } = useLocation();

  const locationArray = pathname.substr(1).split('/');

  const networkId = locationArray[0];

  const allNetworkIds = config.networks.map((network) => network.id);

  function changeNetwork() {
    if (allNetworkIds.includes(networkId) && activeNetworkId !== networkId) {
      // if route contains a network at the beginning replace the network
      setTimeout(() => {
        dispatch({ type: 'setBrandData', brandData: [] }); // TODO: remove when ready
        dispatch({ type: 'changeNetwork', networkId });
      });
    } else if (
      (allNetworkIds.includes(networkId) && defaultNetworkId === networkId) ||
      (networkId === '' && activeNetworkId !== '')
    ) {
      // if selected testnet is the same as the default, reset the default
      dispatch({ type: 'changeNetwork', networkId: '' });
    }
  }

  React.useEffect(changeNetwork, [networkId, activeNetworkId]);

  return <></>;
}
