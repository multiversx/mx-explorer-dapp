import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { networks } from 'config';

import { activeNetworkSelector } from 'redux/selectors';

export const NetworkReady = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const locationArray = pathname.substring(1).split('/');
  const networkId = locationArray[0];
  const allNetworkIds = networks.map((testnet) => testnet.id);

  const [networkReady, setNetworkReady] = useState(false);

  useEffect(() => {
    if (allNetworkIds.includes(networkId) && activeNetworkId !== networkId) {
      setNetworkReady(false);
    } else {
      setNetworkReady(true);
    }
  }, [networkId, allNetworkIds, activeNetworkId]);

  return networkReady ? <>{children}</> : null;
};

export const withNetworkReady = (Component: React.ComponentType) =>
  class WithTestnetReady extends React.Component {
    public render() {
      return (
        <NetworkReady>
          <Component />
        </NetworkReady>
      );
    }
  };
