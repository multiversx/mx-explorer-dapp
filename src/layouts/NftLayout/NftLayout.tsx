import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Outlet, Navigate } from 'react-router-dom';

import { Loader } from 'components';
import {
  useActiveRoute,
  useAdapter,
  useGetPage,
  useIsMainnet,
  useNetworkRoute
} from 'hooks';
import { activeNetworkSelector, nftSelector } from 'redux/selectors';
import { setNft } from 'redux/slices';
import { tokensRoutes } from 'routes';

import { FailedNftDetails } from './FailedNftDetails';
import { NftDetailsCard } from './NftDetailsCard';

export const NftLayout = () => {
  const dispatch = useDispatch();
  const isMainnet = useIsMainnet();
  const activeRoute = useActiveRoute();
  const networkRoute = useNetworkRoute();
  const { getNft } = useAdapter();
  const { hash: identifier } = useParams();
  const { firstPageRefreshTrigger } = useGetPage();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { nftState } = useSelector(nftSelector);

  const isProofRoute =
    activeRoute(tokensRoutes.tokensProofDetails) ||
    activeRoute(tokensRoutes.tokensProofDetailsAccounts);

  const [isDataReady, setIsDataReady] = useState<boolean | undefined>();

  const fetchNftDetails = () => {
    if (identifier) {
      getNft(identifier).then(({ success, data }) => {
        if (success && data) {
          dispatch(setNft({ isFetched: true, nftState: data }));
        }

        setIsDataReady(success);
      });
    }
  };

  useEffect(() => {
    fetchNftDetails();
  }, [firstPageRefreshTrigger, activeNetworkId, identifier]);

  const loading =
    isDataReady === undefined ||
    (identifier && identifier !== nftState.identifier);
  const failed = isDataReady === false;

  if (failed) {
    return <FailedNftDetails identifier={identifier} />;
  }

  if (loading) {
    return <Loader />;
  }

  // Redirect to not-found page until route/api structure final on mainnet
  if (isMainnet && identifier && isProofRoute) {
    return <Navigate replace to={networkRoute('/not-found')} />;
  }

  return (
    <div className='container page-content'>
      <NftDetailsCard />
      <Outlet />
    </div>
  );
};
