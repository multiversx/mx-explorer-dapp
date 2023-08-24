import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useParams, Outlet } from 'react-router-dom';

import { Loader } from 'components';
import { isHash } from 'helpers';
import { useAdapter, useGetPage, useNetworkRoute } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import { setMiniBlock } from 'redux/slices';

import { MiniBlockDetailsCard } from './MiniBlockDetailsCard';
import { MiniBlockNotFound } from './MiniBlockNotFound';

export const MiniBlockLayout = () => {
  const ref = useRef(null);
  const dispatch = useDispatch();

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const { hash: miniBlockHash } = useParams();

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
  }, [firstPageRefreshTrigger, activeNetworkId, miniBlockHash]);

  const invalid = miniBlockHash && !isHash(miniBlockHash);

  const loading = isDataReady === undefined;
  const failed = isDataReady === false;

  return invalid ? (
    <Navigate to={networkRoute('/not-found')} />
  ) : (
    <>
      {loading && <Loader />}
      {!loading && failed && (
        <MiniBlockNotFound miniBlockHash={miniBlockHash} />
      )}

      <div ref={ref}>
        {!loading && !failed && (
          <div className='container page-content'>
            <MiniBlockDetailsCard />
            <Outlet />
          </div>
        )}
      </div>
    </>
  );
};
