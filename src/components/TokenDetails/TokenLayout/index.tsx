import * as React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { tokensRoutes } from 'routes';
import { useGlobalDispatch, useGlobalState } from 'context';
import { Loader, adapter } from 'sharedComponents';
import { useSize, useNetworkRoute } from 'helpers';
import FailedTokenDetails from './FailedTokenDetails';
import TokenDetailsCard from './TokenDetailsCard';

const TokenLayout = ({ children }: { children: React.ReactNode }) => {
  const ref = React.useRef(null);
  const { firstPageTicker } = useSize();
  const { activeNetwork } = useGlobalState();
  const dispatch = useGlobalDispatch();
  const { getToken, getTokenTransactionsCount, getTokenAccountsCount } = adapter();
  const networkRoute = useNetworkRoute();

  const match: any = useRouteMatch(networkRoute(tokensRoutes.tokenDetails));
  const tokenId = match ? match.params.hash : undefined;

  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

  const fetchTokenDetails = () => {
    if (!document.hidden) {
      Promise.all([
        getToken(tokenId),
        getTokenAccountsCount({ tokenId }),
        getTokenTransactionsCount({ tokenId }),
      ]).then(([tokenDetailsData, tokenAccountsCountData, tokenTransactionsCountData]) => {
        if (ref.current !== null) {
          if (
            tokenDetailsData.success &&
            tokenAccountsCountData.success &&
            tokenTransactionsCountData.success
          ) {
            dispatch({
              type: 'setTokenDetails',
              tokenDetails: {
                ...tokenDetailsData.data,
                holders: tokenAccountsCountData.data,
                transactions: tokenTransactionsCountData.data,
              },
            });
            setDataReady(true);
          }

          if (dataReady === undefined) {
            setDataReady(
              tokenDetailsData.success &&
                tokenAccountsCountData.success &&
                tokenTransactionsCountData.success
            );
          }
        }
      });
    }
  };

  React.useEffect(() => {
    fetchTokenDetails();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPageTicker, activeNetwork.id, tokenId]);

  React.useEffect(() => {
    setDataReady(undefined);
  }, [tokenId, activeNetwork.id]);

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

export default TokenLayout;
