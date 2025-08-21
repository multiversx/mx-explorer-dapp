import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet, useParams } from 'react-router-dom';

import { NATIVE_TOKEN_IDENTIFIER } from 'appConstants';
import { Loader } from 'components';
import { useAdapter, useGetPage, useHasExchangeData } from 'hooks';
import { activeNetworkSelector, tokenExtraSelector } from 'redux/selectors';
import { setToken, setTokenExtra } from 'redux/slices';
import { ExchangePriceRangeEnum } from 'types';

import { FailedTokenDetails } from './FailedTokenDetails';
import { TokenDetailsCard } from './TokenDetailsCard';
import { TokenHolderDetailsCard } from './TokenHolderDetailsCard';

export const TokenLayout = () => {
  const dispatch = useDispatch();
  const { getToken, getExchangeTokenPriceHistory } = useAdapter();
  const { hash: identifier } = useParams();
  const { firstPageRefreshTrigger } = useGetPage();
  const { id: activeNetworkId, egldLabel } = useSelector(activeNetworkSelector);
  const { tokenExtra } = useSelector(tokenExtraSelector);

  const hasExchangeData = useHasExchangeData();
  const isNativeToken =
    identifier &&
    (identifier.toLowerCase() === egldLabel?.toLowerCase() ||
      identifier.toLowerCase() === NATIVE_TOKEN_IDENTIFIER.toLowerCase());

  const [isDataReady, setIsDataReady] = useState<boolean | undefined>();

  const fetchTokenDetails = () => {
    if (identifier) {
      const promises = [
        getToken(identifier),
        ...(hasExchangeData && tokenExtra.identifier !== identifier
          ? [getExchangeTokenPriceHistory({ identifier })]
          : [])
      ];
      Promise.all(promises).then((response) => {
        const [tokenData, tokenPriceHistoryData] = response;

        if (tokenData.success && tokenData.data) {
          dispatch(setToken({ isFetched: true, token: tokenData.data }));
          if (hasExchangeData && tokenExtra.identifier !== identifier) {
            dispatch(
              setTokenExtra({
                isFetched: true,
                tokenExtra: {
                  identifier: tokenData.data.identifier,
                  range: ExchangePriceRangeEnum.hourly,
                  priceHistory: tokenPriceHistoryData?.data ?? []
                }
              })
            );
          }
        }
        setIsDataReady(tokenData.success);
      });
    }
  };

  useEffect(() => {
    if (!isNativeToken) {
      fetchTokenDetails();
    }
  }, [firstPageRefreshTrigger, activeNetworkId, identifier, isNativeToken]);

  const loading = isDataReady === undefined;
  const failed = isDataReady === false;

  if (isNativeToken) {
    return <Navigate replace to={`/${egldLabel?.toLowerCase()}`} />;
  }

  if (failed) {
    return <FailedTokenDetails tokenId={identifier} />;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className='container page-content'>
      <TokenDetailsCard />
      <TokenHolderDetailsCard />
      <Outlet />
    </div>
  );
};
