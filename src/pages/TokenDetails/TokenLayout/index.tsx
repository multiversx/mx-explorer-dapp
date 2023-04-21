import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Loader } from 'components';
import { useAdapter, useGetPage, useGetHash } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import { setToken } from 'redux/slices';

import { FailedTokenDetails } from './FailedTokenDetails';
import { TokenDetailsCard } from './TokenDetailsCard';

export const TokenLayout = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null);
  const { firstPageRefreshTrigger } = useGetPage();

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const dispatch = useDispatch();
  const { getToken } = useAdapter();

  const tokenId = useGetHash();

  const [dataReady, setDataReady] = useState<boolean | undefined>();

  const fetchTokenDetails = () => {
    if (tokenId) {
      getToken(tokenId).then((tokenDetailsData) => {
        if (ref.current !== null) {
          if (tokenDetailsData.success && tokenDetailsData?.data) {
            dispatch(setToken(tokenDetailsData.data));
            setDataReady(true);
          }

          if (dataReady === undefined) {
            setDataReady(tokenDetailsData.success);
          }
        }
      });
    }
  };

  useEffect(() => {
    fetchTokenDetails();
  }, [firstPageRefreshTrigger, activeNetworkId, tokenId]);

  const loading = dataReady === undefined;
  const failed = dataReady === false;

  return (
    <>
      {loading && <Loader />}
      {!loading && failed && <FailedTokenDetails tokenId={tokenId} />}

      <div ref={ref}>
        {!loading && !failed && (
          <div className='container page-content'>
            <TokenDetailsCard />
            {children}
          </div>
        )}
      </div>
    </>
  );
};
