import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { Chart, Loader, PageState } from 'components';
import { ChartConfigType } from 'components/Chart/helpers/types';
import { getPrimaryColor, isValidTokenPrice } from 'helpers';
import { useAdapter } from 'hooks';
import { faCoins } from 'icons/regular';
import { TokenTabs } from 'layouts/TokenLayout/TokenTabs';
import { ChartResolutionSelector } from 'pages/AnalyticsCompare/AnalyticsChart/components/ChartResolution';
import { ChartResolutionRangeType } from 'pages/AnalyticsCompare/AnalyticsChart/components/ChartResolution/types';
import {
  activeNetworkSelector,
  tokenExtraSelector,
  tokenSelector
} from 'redux/selectors';
import { ExchangePriceRangeEnum, GrowthChartDataType } from 'types';

export const TokenDetailsAnalytics = () => {
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { token } = useSelector(tokenSelector);
  const { identifier } = token;
  const { getExchangeTokenPriceHistory } = useAdapter();
  const { tokenExtra } = useSelector(tokenExtraSelector);

  const [tokenPriceHistory, setTokenPriceHistory] = useState<
    GrowthChartDataType[]
  >([]);
  const [range, setRange] = useState<ChartResolutionRangeType>('day');
  const [isDataReady, setIsDataReady] = useState<boolean | undefined>();

  const showTokenPrice = isValidTokenPrice(token);

  const fetchExchangeTokenPriceHistory = () => {
    setIsDataReady(undefined);
    getExchangeTokenPriceHistory({
      identifier,
      range: ExchangePriceRangeEnum.daily
    }).then(({ data, success }) => {
      if (success && data) {
        setTokenPriceHistory(data);
      }
      setIsDataReady(Boolean(success && data));
    });
  };

  useEffect(() => {
    if (
      showTokenPrice &&
      identifier &&
      range !== 'day' &&
      tokenPriceHistory.length === 0
    ) {
      fetchExchangeTokenPriceHistory();
      return;
    }
    setIsDataReady(true);
  }, [activeNetworkId, identifier, showTokenPrice, range, tokenPriceHistory]);

  const priceHistory = useMemo(() => {
    switch (range) {
      case 'day':
        return tokenExtra.priceHistory;
      case 'week':
        return tokenPriceHistory.slice(-7);
      case 'month':
        return tokenPriceHistory.slice(-30);
      case 'year':
        return tokenPriceHistory.slice(-365);
      case 'all':
      default:
        return tokenPriceHistory;
    }
  }, [range, tokenPriceHistory, tokenExtra.priceHistory]);

  const primary = getPrimaryColor();
  const dateFormat = range === 'day' ? 'HH:mm UTC' : 'D MMM YYYY';

  const config: ChartConfigType[] = [
    {
      id: 'price',
      label: 'price',
      gradient: 'defaultGradient',
      stroke: primary,
      data: priceHistory,
      yAxisConfig: {
        orientation: 'left',
        currency: '$',
        domain: range === 'day' ? ['auto', 'auto'] : undefined
      }
    }
  ];

  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
          <TokenTabs />
        </div>
      </div>
      <div className='card-body px-lg-spacer py-lg-4'>
        <div className='d-md-flex align-items-center flex-wrap mb-spacer mt-n3'>
          <h5 className='my-3 me-md-auto'>Token Price</h5>
          <div className='d-flex justify-md-content-end align-items-center ms-auto me-0 mt-3 mt-md-0'>
            <div className='mb-0'>
              <ChartResolutionSelector
                isResponsive={true}
                hasDayOption={true}
                value={range}
                onChange={(resolution) => {
                  setRange(resolution.range);
                }}
              />
            </div>
          </div>
        </div>
        <Chart.Body>
          {isDataReady === undefined && <Loader />}
          {isDataReady === false && (
            <PageState
              icon={faCoins}
              title={`Unable to load ${identifier} Analytics`}
              className='my-auto'
              titleClassName='mt-0'
              isError={true}
            />
          )}
          {isDataReady === true && (
            <>
              {priceHistory.length > 1 ? (
                <div className='mx-n4'>
                  <Chart.Area
                    config={config}
                    tooltip={{
                      dateFormat
                    }}
                    dateFormat={dateFormat}
                  ></Chart.Area>
                </div>
              ) : (
                <PageState
                  icon={faCoins}
                  title={`Not Enough ${identifier} Price Entries`}
                  className='my-auto'
                  titleClassName='mt-0'
                  data-testid='accountChartSmall'
                />
              )}
            </>
          )}
        </Chart.Body>
      </div>
    </div>
  );
};
