import { useGlobalState } from 'context';
import React from 'react';
import { useLocation } from 'react-router-dom';

const NetworkReady: React.FC = ({ children }) => {
  const globalState = useGlobalState();
  const { activeNetworkId } = useGlobalState();
  const { pathname } = useLocation();

  const locationArray = pathname.substr(1).split('/');
  const networkId = locationArray[0];
  const allNetworkIds = globalState.config.networks.map((testnet) => testnet.id);

  const [networkReady, setNetworkReady] = React.useState(false);

  React.useEffect(() => {
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

export default NetworkReady;
