import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Outlet } from 'react-router-dom';

import { Loader } from 'components';
import { useAdapter, useGetPage } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import { setNft } from 'redux/slices';

import { FailedNftDetails } from './FailedNftDetails';
import { NftDetailsCard } from './NftDetailsCard';

export const NftLayout = () => {
  const ref = useRef(null);
  const { firstPageRefreshTrigger } = useGetPage();

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const dispatch = useDispatch();
  const { getNft } = useAdapter();

  const { hash: identifier } = useParams();

  const [dataReady, setDataReady] = useState<boolean | undefined>();

  const fetchNftDetails = () => {
    if (identifier) {
      getNft(identifier).then((nftDetailsData) => {
        if (ref.current !== null) {
          if (nftDetailsData.success && nftDetailsData?.data) {
            dispatch(setNft(nftDetailsData.data));
            setDataReady(true);
          }

          if (dataReady === undefined) {
            setDataReady(nftDetailsData.success);
          }
        }
      });
    }
  };

  useEffect(() => {
    fetchNftDetails();
  }, [firstPageRefreshTrigger, activeNetworkId, identifier]);

  const loading = dataReady === undefined;
  const failed = dataReady === false;

  return (
    <>
      {loading && <Loader />}
      {!loading && failed && <FailedNftDetails identifier={identifier} />}

      <div ref={ref}>
        {!loading && !failed && (
          <div className='container page-content'>
            <NftDetailsCard />
            <Outlet />
          </div>
        )}
      </div>
    </>
  );
};
