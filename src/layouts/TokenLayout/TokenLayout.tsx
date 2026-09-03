import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet, useParams } from 'react-router-dom';

import { NATIVE_TOKEN_IDENTIFIER } from 'appConstants';
import { Loader } from 'components';
import { isEgldToken } from 'helpers';
import {
  useAbortSignal,
  useAdapter,
  useGetPage,
  useHasExchangeData
} from 'hooks';
import { activeNetworkSelector, tokenExtraSelector } from 'redux/selectors';
import { setToken, setTokenExtra } from 'redux/slices';
import { ExchangePriceRangeEnum } from 'types';

import { FailedTokenDetails } from './FailedTokenDetails';
import { TokenDetailsCard } from './TokenDetailsCard';
import { TokenHolderDetailsCard } from './TokenHolderDetailsCard';

export const TokenLayout = () => {
  const dispatch = useDispatch();
  const { getToken, getExchangeTokenPriceHistory } = useAdapter();
  const getAbortSignal = useAbortSignal();
  const { hash: identifier = '' } = useParams();
  const { poolingFirstPageRefreshTrigger } = useGetPage();
  const { id: activeNetworkId, egldLabel } = useSelector(activeNetworkSelector);
  const { tokenExtra } = useSelector(tokenExtraSelector);

  const hasExchangeData = useHasExchangeData();
  const isEgldNetworkToken =
    isEgldToken(egldLabel) &&
    identifier.toLowerCase() === NATIVE_TOKEN_IDENTIFIER.toLowerCase();

  const isNativeToken =
    identifier.toLowerCase() === egldLabel?.toLowerCase() || isEgldNetworkToken;

  const [isDataReady, setIsDataReady] = useState<boolean | undefined>();

  const fetchTokenDetails = () => {
    if (identifier) {
      const signal = getAbortSignal();
      const promises = [
        getToken(identifier, { signal }),
        ...(hasExchangeData && tokenExtra.identifier !== identifier
          ? [getExchangeTokenPriceHistory({ identifier, signal })]
          : [])
      ];
      Promise.all(promises).then((response) => {
        if (signal.aborted) {
          return;
        }

        const [tokenData, tokenPriceHistoryData] = response;

        if (tokenData.success && tokenData.data) {
          dispatch(setToken({ isDataReady: true, token: tokenData.data }));
          if (hasExchangeData && tokenExtra.identifier !== identifier) {
            dispatch(
              setTokenExtra({
                isDataReady: true,
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
  }, [
    poolingFirstPageRefreshTrigger,
    activeNetworkId,
    identifier,
    isNativeToken
  ]);

  const loading = isDataReady === undefined;
  const failed = isDataReady === false;

  if (isNativeToken) {
    return <Navigate replace to={`/${egldLabel?.toLowerCase()}`} />;
  }

  if (failed) {
    return <FailedTokenDetails tokenIdentifier={identifier} />;
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
