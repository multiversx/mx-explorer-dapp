import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import { faChartBar } from '@fortawesome/pro-regular-svg-icons/faChartBar';

import { useSelector } from 'react-redux';
import { PageState, Chart, Loader, useAdapter } from 'components';
import { ChartConfigType } from 'components/Chart/helpers/types';
import { activeNetworkSelector } from 'redux/selectors';

export interface AnalyticsStackedChartDataPoCType {
  value: string;
  timestamp: number;
}

export const AnalyticsStackedChartPoC = ({
  ids,
  firstSeriesLabel,
  secondSeriesLabel,
  title
}: {
  ids: string[];
  firstSeriesLabel: string;
  secondSeriesLabel: string;
  title?: string;
}) => {
  const ref = useRef(null);

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { getAnalyticsChart } = useAdapter();

  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [firstSeries, setFirstSeries] = useState<
    AnalyticsStackedChartDataPoCType[]
  >([]);
  const [secondSeries, setSecondSeries] = useState<
    AnalyticsStackedChartDataPoCType[]
  >([]);

  const firstSeriesPath = ids[0];
  const secondSeriesPath = ids[1];

  const getChartPropsFromId = (id: string) => {
    switch (id) {
      case 'daily-total-staked-egld-monthly':
      case 'total-value-locked-plus-staking-monthly':
      case 'daily-fees-captured-monthly':
        return {
          currency: 'EGLD'
        };
      case 'daily-average-ape-monthly':
      case 'daily-base-ape-monthly':
      case 'daily-topup-ape-monthly':
        return {
          percentageMultiplier: 100
        };
      case 'daily-developer-rewards-monthly':
      case 'daily-inflation-monthly':
        return {
          denomination: 18,
          currency: 'EGLD'
        };
      case 'daily-new-smart-contracts-monthly':
      case 'daily-new-fungible-esdts-monthly':
      case 'daily-new-nonfungible-esdts-monthly':
      case 'daily-new-semifungible-esdts-monthly':
      case 'daily-new-meta-esdts-monthly':
      case 'daily-new-nfts-monthly':
      case 'number-of-blocks-created-per-day-monthly':
      case 'daily-number-of-active-users-monthly':
      case 'daily-number-of-address-to-address-transactions-monthly':
      case 'daily-number-of-address-to-contract-transactions-monthly':
      case 'daily-number-of-contract-to-address-transactions-monthly':
      case 'daily-number-of-contract-to-contract-transactions-monthly':
      case 'daily-number-of-token-transfers-monthly':
      default:
        return {};
    }
  };

  const firstSeriesConfig: ChartConfigType = {
    id: firstSeriesLabel,
    label: firstSeriesLabel,
    gradient: 'defaultGradient',
    data: firstSeries
  };
  const secondSeriesConfig: ChartConfigType = {
    id: secondSeriesLabel,
    label: secondSeriesLabel,
    gradient: 'defaultGradient',
    data: secondSeries
  };
  const getData = useCallback(async () => {
    const [firstSeriesData, secondSeriesData] = await Promise.allSettled([
      getAnalyticsChart(firstSeriesPath),
      getAnalyticsChart(secondSeriesPath)
    ]);

    if (firstSeriesData.status === 'fulfilled') {
      setFirstSeries(firstSeriesData.value.data?.data ?? []);
    }

    if (secondSeriesData.status === 'fulfilled') {
      setSecondSeries(
        secondSeriesData.status === 'fulfilled'
          ? secondSeriesData?.value.data?.data
          : []
      );
    }

    setDataReady(
      firstSeriesData.status === 'fulfilled' &&
        secondSeriesData.status === 'fulfilled' &&
        firstSeriesData.value.success &&
        secondSeriesData.value.success
    );
  }, [firstSeriesPath, secondSeriesPath]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getData();
  }, [activeNetworkId, firstSeriesPath, secondSeriesPath]);

  return (
    <>
      <section id={ids.join('/')} ref={ref} className='card'>
        <Chart.Heading title={title} className=''></Chart.Heading>
        <Chart.Body>
          {dataReady === undefined && <Loader />}
          {dataReady === false && (
            <PageState
              icon={faChartBar}
              title='Unable to load Chart'
              className='py-spacer my-auto'
              titleClassName='mt-0'
              dataTestId='accountsChartError'
            />
          )}
          {dataReady === true &&
            (firstSeries?.length === 0 || secondSeries?.length === 0) && (
              <PageState
                icon={faChartBar}
                title='Missing Chart data'
                className='py-spacer my-auto'
                titleClassName='mt-0'
                dataTestId='accountsChartError'
              />
            )}

          {dataReady === true &&
            firstSeries.length > 0 &&
            secondSeries.length > 0 && (
              <Chart.ComposedChartPoC
                config={{
                  firstSeriesConfig,
                  secondSeriesConfig
                }}
                hasOnlyStartEndTick
                {...getChartPropsFromId(ids[1])}
              ></Chart.ComposedChartPoC>
            )}
        </Chart.Body>
      </section>
    </>
  );
};