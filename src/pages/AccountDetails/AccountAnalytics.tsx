import { useEffect, useState } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { ELLIPSIS, NATIVE_TOKEN_SEARCH_LABEL } from 'appConstants';
import { Loader, PageState, Chart, TokenSelectFilter } from 'components';
import {
  getNormalizedTimeEntries,
  getFrequency
} from 'components/Chart/helpers/getChartBinnedData';
import { ChartDataType, ChartConfigType } from 'components/Chart/helpers/types';
import { getPrimaryColor, isValidTokenPrice } from 'helpers';
import { useAdapter } from 'hooks';
import { faChartBar } from 'icons/regular';
import { AccountTabs } from 'layouts/AccountLayout/AccountTabs';
import { activeNetworkSelector, accountSelector } from 'redux/selectors';
import { AccountBalanceHistoryType, TokenType } from 'types';

export const AccountAnalytics = () => {
  const { account } = useSelector(accountSelector);
  const { address } = account;
  const [searchParams] = useSearchParams();
  const { id: activeNetworkId, egldLabel } = useSelector(activeNetworkSelector);
  const { getAccountHistory, getToken } = useAdapter();

  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [tokenPrice, setTokenPrice] = useState<number | undefined>();
  const [currency, setCurrency] = useState(egldLabel);
  const [selectDefaultValue, setSelectDefaultValue] = useState({
    value: NATIVE_TOKEN_SEARCH_LABEL,
    label: egldLabel
  });
  const [chartData, setChartData] = useState<ChartDataType[]>([]);
  const [startDate, setStartDate] = useState<string>(ELLIPSIS);
  const [endDate, setEndDate] = useState<string>(ELLIPSIS);

  const primary = getPrimaryColor();
  const { token } = Object.fromEntries(searchParams);
  const showUsdValue =
    !Boolean(token) || Boolean(token && tokenPrice && token !== egldLabel);

  const getChartData = async () => {
    setTokenPrice(undefined);
    let searchedToken = undefined;
    if (token && token !== egldLabel) {
      const { success: searchedTokenSuccess, data: searchedTokenData } =
        await getToken(token);

      if (!searchedTokenSuccess) {
        setDataReady(true);
        return;
      }

      const { identifier, assets, ticker, price } =
        searchedTokenData as TokenType;
      const label = assets && ticker ? ticker : identifier;
      const defaultVal = {
        value: identifier,
        label,
        ...(assets?.svgUrl ? { svgUrl: assets.svgUrl } : {})
      };

      if (price && isValidTokenPrice(searchedTokenData)) {
        setTokenPrice(price);
      }
      setSelectDefaultValue(defaultVal);
      searchedToken = searchedTokenData;
    }

    const { success: accountsHistroySuccess, data: accountsHistoryData } =
      await getAccountHistory({
        address,
        size: 100,
        ...(token !== egldLabel ? { identifier: token } : {})
      });

    if (accountsHistroySuccess && accountsHistoryData?.length > 0) {
      const updatedData = searchedToken
        ? accountsHistoryData.map((historyData: AccountBalanceHistoryType) => {
            return { ...historyData, decimals: searchedToken.decimals };
          })
        : accountsHistoryData;

      const reversedData = updatedData.reverse();
      const startTimestamp = reversedData[0].timestamp;
      const endTimestamp = reversedData[reversedData.length - 1].timestamp;

      const frequency = getFrequency(reversedData);
      const normalizedData = getNormalizedTimeEntries(reversedData, frequency);

      setCurrency(
        searchedToken?.ticker ?? searchedToken?.identifier ?? egldLabel
      );
      setChartData(normalizedData);

      setStartDate(moment.unix(startTimestamp).utc().format('MMM DD, YYYY'));
      setEndDate(moment.unix(endTimestamp).utc().format('MMM DD, YYYY'));
    }

    setDataReady(accountsHistroySuccess);
  };

  const config: ChartConfigType[] = [
    {
      id: 'balance',
      label: 'balance',
      gradient: 'defaultGradient',
      stroke: primary,
      data: chartData,
      showUsdValue,
      yAxisConfig: {
        currency,
        orientation: 'left'
      },
      ...(tokenPrice ? { price: tokenPrice } : {})
    }
  ];

  useEffect(() => {
    getChartData();
  }, [activeNetworkId, searchParams, egldLabel]);

  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
          <AccountTabs />
          <div className='d-flex flex-wrap align-items-center w-100'>
            Account{' '}
            <TokenSelectFilter
              name='token-filter'
              filter='token'
              placeholder='Search for a Token'
              noOptionsMessage='Invalid Identifier'
              className='account-analytics-token-select mx-2'
              defaultToken={NATIVE_TOKEN_SEARCH_LABEL}
              hasShowAllOption={false}
              isClearable={false}
            />{' '}
            Balance{' '}
            {chartData.length > 1 && (
              <span className='text-neutral-400 ms-1'>
                ( from {startDate} to {endDate} )
              </span>
            )}
          </div>
        </div>
      </div>
      <div className='card-body px-lg-spacer py-lg-4'>
        <Chart.Body>
          {dataReady === undefined && <Loader />}
          {dataReady === false && (
            <PageState
              icon={faChartBar}
              title='Unable to load balance chart'
              className='my-auto'
              titleClassName='mt-0'
              data-testid='accountChartError'
            />
          )}
          {dataReady === true && (
            <>
              {chartData.length > 1 ? (
                <div className='mx-n4'>
                  <Chart.AreaNew
                    config={config}
                    tooltip={{
                      dateFormat: 'MMM DD, YYYY HH:mm:ss UTC'
                    }}
                  ></Chart.AreaNew>
                </div>
              ) : (
                <PageState
                  icon={faChartBar}
                  title={
                    chartData.length === 0
                      ? 'No account balance history'
                      : 'Not enough entries to display the chart'
                  }
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
