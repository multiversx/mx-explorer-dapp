import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useParams, Outlet } from 'react-router-dom';

import { Loader } from 'components';
import { isHash } from 'helpers';
import { useAdapter, useGetPage, useNetworkRoute } from 'hooks';
import { activeNetworkSelector, miniBlockSelector } from 'redux/selectors';
import { setMiniBlock } from 'redux/slices';

import { MiniBlockDetailsCard } from './MiniBlockDetailsCard';
import { MiniBlockNotFound } from './MiniBlockNotFound';

export const MiniBlockLayout = () => {
  const dispatch = useDispatch();
  const networkRoute = useNetworkRoute();
  const { getMiniBlock } = useAdapter();
  const { hash: miniBlockHash } = useParams();
  const { firstPageRefreshTrigger } = useGetPage();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { miniBlockHash: stateMiniBlockHash } = useSelector(miniBlockSelector);

  const [isDataReady, setIsDataReady] = useState<boolean | undefined>();

  const fetchMiniBlockDetails = () => {
    if (miniBlockHash) {
      getMiniBlock(miniBlockHash).then(({ success, data }) => {
        if (success && data) {
          dispatch(setMiniBlock(data));
        }

        setIsDataReady(success);
      });
    }
  };

  useEffect(() => {
    fetchMiniBlockDetails();
  }, [firstPageRefreshTrigger, activeNetworkId, miniBlockHash]);

  const invalid = miniBlockHash && !isHash(miniBlockHash);

  const loading =
    isDataReady === undefined ||
    (miniBlockHash && miniBlockHash !== stateMiniBlockHash);
  const failed = isDataReady === false;

  if (invalid) {
    return <Navigate to={networkRoute('/not-found')} />;
  }

  if (failed) {
    return <MiniBlockNotFound miniBlockHash={miniBlockHash} />;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className='container page-content'>
      <MiniBlockDetailsCard />
      <Outlet />
    </div>
  );
};
