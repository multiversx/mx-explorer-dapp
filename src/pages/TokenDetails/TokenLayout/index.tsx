import * as React from 'react';

import { Loader, useAdapter } from 'components';
import { useSize, useGetHash } from 'helpers';
import { FailedTokenDetails } from './FailedTokenDetails';
import { TokenDetailsCard } from './TokenDetailsCard';

import { useSelector, useDispatch } from 'react-redux';
import { activeNetworkSelector } from 'redux/selectors';
import { setToken } from 'redux/slices';

export const TokenLayout = ({ children }: { children: React.ReactNode }) => {
  const ref = React.useRef(null);
  const { firstPageTicker } = useSize();

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const dispatch = useDispatch();
  const { getToken } = useAdapter();

  const tokenId = useGetHash();

  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

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

  React.useEffect(() => {
    fetchTokenDetails();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPageTicker, activeNetworkId, tokenId]);

  React.useEffect(() => {
    setDataReady(undefined);
  }, [tokenId, activeNetworkId]);

  const loading = dataReady === undefined;
  const failed = dataReady === false;

  return (
    <>
      {loading && <Loader />}
      {!loading && failed && <FailedTokenDetails tokenId={tokenId} />}

      <div ref={ref}>
        {!loading && !failed && (
          <div className="container page-content">
            <TokenDetailsCard />
            {children}
          </div>
        )}
      </div>
    </>
  );
};
