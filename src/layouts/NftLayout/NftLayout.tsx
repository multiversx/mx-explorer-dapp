import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Outlet } from 'react-router-dom';

import { Loader } from 'components';
import { useAdapter, useGetPage } from 'hooks';
import { activeNetworkSelector, nftSelector } from 'redux/selectors';
import { setNft } from 'redux/slices';

import { FailedNftDetails } from './FailedNftDetails';
import { NftDetailsCard } from './NftDetailsCard';

export const NftLayout = () => {
  const dispatch = useDispatch();
  const { getNft } = useAdapter();
  const { hash: identifier } = useParams();
  const { firstPageRefreshTrigger } = useGetPage();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { nftState } = useSelector(nftSelector);

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

  return (
    <div className='container page-content'>
      <NftDetailsCard />
      <Outlet />
    </div>
  );
};
