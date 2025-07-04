import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { isValidTokenPrice } from 'helpers';
import { useAdapter } from 'hooks';
import { activeNetworkSelector, tokenSelector } from 'redux/selectors';
import { GrowthChartDataType } from 'types';

export const TokenDetailsAnalytics = () => {
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { token } = useSelector(tokenSelector);
  const { identifier, price, supply, decimals } = token;
  const { getExchangeTokenPriceHistory } = useAdapter();

  const [tokenPriceHistory, setTokenPriceHistory] = useState<
    GrowthChartDataType[]
  >([]);
  const [isDataReady, setIsDataReady] = useState<boolean | undefined>();

  const showTokenPrice = isValidTokenPrice(token);

  const fetchExchangeTokenPriceHistory = () => {
    getExchangeTokenPriceHistory({ identifier }).then(({ data, success }) => {
      if (success && data) {
        setTokenPriceHistory(data);
      }
      setIsDataReady(Boolean(success && data));
    });
  };

  useEffect(() => {
    if (showTokenPrice && identifier) {
      fetchExchangeTokenPriceHistory();
    }
  }, [activeNetworkId, identifier, showTokenPrice]);

  return <></>;
};
