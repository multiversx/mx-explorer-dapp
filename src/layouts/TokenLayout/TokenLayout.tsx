import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet, useParams } from 'react-router-dom';

import { NATIVE_TOKEN_IDENTIFIER } from 'appConstants';
import { Loader } from 'components';
import { useAdapter, useGetPage } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import { setToken } from 'redux/slices';

import { FailedTokenDetails } from './FailedTokenDetails';
import { TokenDetailsCard } from './TokenDetailsCard';

export const TokenLayout = () => {
  const dispatch = useDispatch();
  const { getToken } = useAdapter();
  const { hash: tokenId } = useParams();
  const { firstPageRefreshTrigger } = useGetPage();
  const { id: activeNetworkId, egldLabel } = useSelector(activeNetworkSelector);

  const isNativeToken =
    tokenId &&
    (tokenId.toLowerCase() === egldLabel?.toLowerCase() ||
      tokenId.toLowerCase() === NATIVE_TOKEN_IDENTIFIER.toLowerCase());

  const [isDataReady, setIsDataReady] = useState<boolean | undefined>();

  const fetchTokenDetails = () => {
    if (tokenId) {
      getToken(tokenId).then(({ success, data }) => {
        if (success && data) {
          dispatch(setToken({ isFetched: true, token: data }));
        }

        setIsDataReady(success);
      });
    }
  };

  useEffect(() => {
    if (!isNativeToken) {
      fetchTokenDetails();
    }
  }, [firstPageRefreshTrigger, activeNetworkId, tokenId, isNativeToken]);

  const loading = isDataReady === undefined;
  const failed = isDataReady === false;

  if (isNativeToken) {
    return <Navigate replace to={`/${egldLabel?.toLowerCase()}`} />;
  }

  if (failed) {
    return <FailedTokenDetails tokenId={tokenId} />;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className='container page-content'>
      <TokenDetailsCard />
      <Outlet />
    </div>
  );
};
