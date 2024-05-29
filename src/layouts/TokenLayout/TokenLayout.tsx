import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Outlet } from 'react-router-dom';

import { Loader } from 'components';
import { useAdapter, useGetPage } from 'hooks';
import { activeNetworkSelector, tokenSelector } from 'redux/selectors';
import { setToken } from 'redux/slices';

import { FailedTokenDetails } from './FailedTokenDetails';
import { TokenDetailsCard } from './TokenDetailsCard';

export const TokenLayout = () => {
  const dispatch = useDispatch();
  const { getToken } = useAdapter();
  const { hash: tokenId } = useParams();
  const { firstPageRefreshTrigger } = useGetPage();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { token, isFetched } = useSelector(tokenSelector);

  const [isDataReady, setIsDataReady] = useState<boolean | undefined>();

  const fetchTokenDetails = () => {
    if (tokenId) {
      getToken(tokenId).then(({ success, data }) => {
        console.log('----data', data);
        if (success && data) {
          dispatch(setToken({ isFetched: true, token: data }));
        }

        setIsDataReady(success);
      });
    }
  };

  useEffect(() => {
    fetchTokenDetails();
  }, [firstPageRefreshTrigger, activeNetworkId, tokenId]);

  console.log('---isDataReady', isDataReady, token, isFetched);

  const loading =
    isDataReady === undefined || (tokenId && tokenId !== token.identifier);
  const failed = isDataReady === false;

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
