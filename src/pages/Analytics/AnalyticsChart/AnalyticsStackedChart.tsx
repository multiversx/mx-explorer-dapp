import React, { useCallback, useEffect, useRef, useState } from 'react';
import { faChartBar } from '@fortawesome/pro-regular-svg-icons/faChartBar';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { PageState, Chart, Loader, useAdapter } from 'components';
import { ChartConfigType } from 'components/Chart/helpers/types';
import { activeNetworkSelector } from 'redux/selectors';
import {
  ChartResolutionRangeType,
  ChartResolutionSelector
} from './components/ChartResolution';
import { capitalize } from '../../../helpers';
import { ChartListType } from '../Analytics';
import { RANGE } from '../constants';

export interface AnalyticsStackedChartDataPoCType {
  value: string;
  timestamp: number;
}

export const AnalyticsStackedChart = ({
  firstSeries,
  secondSeries
}: {
  firstSeries: ChartListType;
  secondSeries: ChartListType;
}) => {
  const ref = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const ids = [firstSeries.path, secondSeries.path];
  const firstSeriesPath = ids[0];
  const secondSeriesPath = ids[1];
  const range = searchParams.get(RANGE) as ChartResolutionRangeType;
  const firstSeriesLabel = firstSeries.label;
  const secondSeriesLabel = secondSeries.label;
  const title = `${capitalize(firstSeriesLabel)} vs. ${capitalize(
    secondSeriesLabel
  )} in the past`;

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { getAnalyticsChart } = useAdapter();

  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [firstSeriesData, setFirstSeriesData] = useState<
    AnalyticsStackedChartDataPoCType[]
  >([]);
  const [secondSeriesData, setSecondSeriesData] = useState<
    AnalyticsStackedChartDataPoCType[]
  >([]);

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

  const [teal, violet400] = ['teal', 'violet-400'].map((color) =>
    getComputedStyle(document.documentElement)
      .getPropertyValue(`--${color}`)
      .trim()
  );

  const firstSeriesConfig: ChartConfigType = {
    id: firstSeriesLabel,
    label: firstSeriesLabel,
    gradient: 'firstSeriesGradientId',
    data: firstSeriesData,
    stroke: violet400
  };
  const secondSeriesConfig: ChartConfigType = {
    id: secondSeriesLabel,
    label: secondSeriesLabel,
    gradient: 'secondSeriesGradientId',
    data: secondSeriesData,
    stroke: teal
  };
  const getData = useCallback(async () => {
    const [firstSeriesData, secondSeriesData] = await Promise.allSettled([
      getAnalyticsChart(`${firstSeriesPath}?range=${range}`),
      getAnalyticsChart(`${secondSeriesPath}?range=${range}`)
    ]);

    if (firstSeriesData.status === 'fulfilled') {
      setFirstSeriesData(firstSeriesData.value.data?.data ?? []);
    }

    if (secondSeriesData.status === 'fulfilled') {
      setSecondSeriesData(
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
  }, [firstSeriesPath, secondSeriesPath, range]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getData();
  }, [activeNetworkId, firstSeriesPath, secondSeriesPath, range]);

  return (
    <>
      <section id={ids.join('/')} ref={ref} className='card'>
        <div className='d-flex align-items-center'>
          <Chart.Heading title={title} className=''></Chart.Heading>
          <ChartResolutionSelector
            value={range}
            onChange={(resolution) => {
              searchParams.set('range', resolution.range);
              setSearchParams(searchParams);
            }}
          />
        </div>

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
            (firstSeriesData?.length === 0 ||
              secondSeriesData?.length === 0) && (
              <PageState
                icon={faChartBar}
                title='Missing Chart data'
                className='py-spacer my-auto'
                titleClassName='mt-0'
                dataTestId='accountsChartError'
              />
            )}

          {dataReady === true &&
            firstSeriesData.length > 0 &&
            secondSeriesData.length > 0 && (
              <Chart.Composed
                config={{
                  firstSeriesConfig,
                  secondSeriesConfig
                }}
                {...getChartPropsFromId(ids[1])}
              ></Chart.Composed>
            )}
        </Chart.Body>
      </section>
    </>
  );
};
