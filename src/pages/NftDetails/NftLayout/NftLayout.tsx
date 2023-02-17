import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Loader } from 'components';
import { useAdapter, useSize, useGetHash } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import { setNft } from 'redux/slices';

import { FailedNftDetails } from './FailedNftDetails';
import { NftDetailsCard } from './NftDetailsCard';

export const NftLayout = ({ children }: { children: React.ReactNode }) => {
  const ref = React.useRef(null);
  const { firstPageTicker } = useSize();

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const dispatch = useDispatch();
  const { getNft } = useAdapter();

  const identifier = useGetHash();

  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

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

  React.useEffect(() => {
    fetchNftDetails();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPageTicker, activeNetworkId, identifier]);

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
            {children}
          </div>
        )}
      </div>
    </>
  );
};
