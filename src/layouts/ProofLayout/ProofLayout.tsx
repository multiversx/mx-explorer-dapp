import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { useIsMainnet, useNetworkRoute } from 'hooks';
import { NftLayout } from 'layouts/NftLayout';
import { activeNetworkSelector } from 'redux/selectors';

import { ProofEndpointLayout } from './ProofEndpointLayout';

export const ProofLayout = () => {
  const isMainnet = useIsMainnet();
  const networkRoute = useNetworkRoute();
  const { hasProofsEndpoint } = useSelector(activeNetworkSelector);

  // Redirect to not-found page until route/api structure final on mainnet
  if (isMainnet) {
    return <Navigate replace to={networkRoute('/not-found')} />;
  }

  if (hasProofsEndpoint) {
    return <ProofEndpointLayout />;
  }

  return <NftLayout />;
};
