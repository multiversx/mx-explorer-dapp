import React from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalDispatch, useGlobalState } from 'context';
import { defaultNetwork } from 'context/config';
import buildConfig from 'context/getAsyncConfig';

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
    const network =
      config.networks.find((t) => {
        if (networkId) {
          return t.id === networkId;
        } else return t.default;
      }) || defaultNetwork;

    if (allNetworkIds.includes(networkId) && activeNetworkId !== networkId) {
      // if route contains a network at the beginning replace the network
      dispatch({ type: 'setBrandData', brandData: [] });
      if (network.fetchedFromNetworkConfig === undefined) {
        buildConfig(networkId, config).then((config) => {
          dispatch({ type: 'updateNetworks', config });
          dispatch({ type: 'changeNetwork', networkId });
        });
      } else {
        dispatch({ type: 'changeNetwork', networkId });
      }

      dispatch({ type: 'changeNetwork', networkId });
    } else if (
      (allNetworkIds.includes(networkId) && defaultNetworkId === networkId) ||
      (networkId === '' && activeNetworkId !== '')
    ) {
      // if selected testnet is the same as the default, reset the default
      dispatch({ type: 'changeNetwork', networkId: '' });
    }
  }

  React.useEffect(changeNetwork, [networkId]);

  return <></>;
}
