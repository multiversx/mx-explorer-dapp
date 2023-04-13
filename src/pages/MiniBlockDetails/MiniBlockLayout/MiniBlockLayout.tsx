import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Loader } from 'components';
import { isHash } from 'helpers';
import { useAdapter, useGetPage, useNetworkRoute, useGetHash } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import { setMiniBlock } from 'redux/slices';

import { MiniBlockDetailsCard } from './MiniBlockDetailsCard';
import { MiniBlockNotFound } from './MiniBlockNotFound';

export const MiniBlockLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const ref = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const miniBlockHash = useGetHash();

  const { firstPageRefreshTrigger } = useGetPage();
  const networkRoute = useNetworkRoute();

  const { getMiniBlock } = useAdapter();

  const [isDataReady, setIsDataReady] = useState<boolean | undefined>();

  const fetchMiniBlockDetails = () => {
    if (miniBlockHash) {
      getMiniBlock(miniBlockHash).then((miniBlockDetailsData) => {
        if (ref.current !== null) {
          if (miniBlockDetailsData.success && miniBlockDetailsData?.data) {
            dispatch(setMiniBlock(miniBlockDetailsData.data));
            setIsDataReady(true);
          }
        }
      });
    }
  };

  useEffect(() => {
    fetchMiniBlockDetails();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPageRefreshTrigger, activeNetworkId, miniBlockHash]);

  const invalid = miniBlockHash && !isHash(miniBlockHash);

  const loading = isDataReady === undefined;
  const failed = isDataReady === false;

  if (invalid) {
    navigate(networkRoute('/not-found'));
  }

  return (
    <>
      {loading && <Loader />}
      {!loading && failed && (
        <MiniBlockNotFound miniBlockHash={miniBlockHash} />
      )}

      <div ref={ref}>
        {!loading && !failed && (
          <div className='container page-content'>
            <MiniBlockDetailsCard />
            {children}
          </div>
        )}
      </div>
    </>
  );
};
