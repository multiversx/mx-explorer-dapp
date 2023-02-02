import React, { useEffect, useRef, useState } from 'react';
import { faChartBar } from '@fortawesome/pro-regular-svg-icons/faChartBar';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { PageState, Chart, Loader } from 'components';
import { ChartConfigType, ChartListType } from 'components/Chart/helpers/types';
import { useAdapter } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';

import { ChartResolutionSelector } from './components/ChartResolution';
import { ChartResolutionRangeType } from './components/ChartResolution/types';

import { RANGE } from '../constants';

export interface AnalyticsStackedChartDataType {
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

  const firstSeriesPath = firstSeries.path;
  const secondSeriesPath = secondSeries.path;
  const range = searchParams.get(RANGE) as ChartResolutionRangeType;
  const firstSeriesLabel = firstSeries.label;
  const secondSeriesLabel = secondSeries.label;

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { getAnalyticsChart } = useAdapter();

  const [firstSeriesConfig, setFirstSeriesConfig] = useState<ChartConfigType>();
  const [secondSeriesConfig, setSecondSeriesConfig] =
    useState<ChartConfigType>();

  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [firstSeriesData, setFirstSeriesData] = useState<
    AnalyticsStackedChartDataType[]
  >([]);
  const [secondSeriesData, setSecondSeriesData] = useState<
    AnalyticsStackedChartDataType[]
  >([]);

  const [teal, violet400] = ['teal', 'violet-400'].map((color) =>
    getComputedStyle(document.documentElement)
      .getPropertyValue(`--${color}`)
      .trim()
  );

  const firstSeriesDefaultConfig = {
    gradient: 'firstSeriesGradientId',
    gradientStopColor: violet400,
    stroke: violet400,
    legendStyle: {
      color: violet400,
      borderColor: violet400
    }
  };
  const secondSeriesDefaultConfig = {
    gradient: 'secondSeriesGradientId',
    gradientStopColor: teal,
    stroke: teal,
    legendStyle: {
      color: teal,
      borderColor: teal
    }
  };

  const getData = async () => {
    const [firstSeriesData, secondSeriesData] = await Promise.allSettled([
      getAnalyticsChart(`${firstSeriesPath}?range=${range}`),
      getAnalyticsChart(`${secondSeriesPath}?range=${range}`)
    ]);

    if (
      firstSeriesData.status === 'fulfilled' &&
      secondSeriesData.status === 'fulfilled' &&
      firstSeriesData.value.success &&
      secondSeriesData.value.success
    ) {
      setFirstSeriesData(firstSeriesData.value.data?.data ?? []);
      setSecondSeriesData(secondSeriesData?.value.data?.data ?? []);
      setDataReady(true);

      return;
    }

    setDataReady(false);

    return {
      firstSeriesData,
      secondSeriesData
    };
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getData();
  }, [activeNetworkId, range, firstSeries.id, secondSeries.id]);

  useEffect(() => {
    setFirstSeriesConfig({
      ...firstSeriesDefaultConfig,
      id: firstSeriesLabel,
      label: firstSeriesLabel,
      data: firstSeriesData,
      yAxisConfig: {
        ...firstSeries.dappConfig,
        id: 'left-axis',
        orientation: 'left'
      }
    });
    setSecondSeriesConfig({
      ...secondSeriesDefaultConfig,
      id: secondSeriesLabel,
      label: secondSeriesLabel,
      data: secondSeriesData,
      yAxisConfig: {
        ...secondSeries.dappConfig,
        id: 'right-axis',
        orientation: 'right'
      }
    });
  }, [firstSeriesData, secondSeriesData]);

  return (
    <>
      <section id={[firstSeries.id, secondSeries.id].join('/')} ref={ref}>
        <div className='d-flex align-items-center flex-wrap justify-content-between mb-md-spacer'>
          <h5 className='mb-0 pt-4 mb-3 mb-md-0 pt-md-0'>
            <span>{firstSeriesLabel}</span>
            <span className='mx-2'>vs.</span>
            <span>{secondSeriesLabel}</span>
          </h5>
          <div className='d-flex justify-content-end align-items-center me-0'>
            <div className='mb-spacer mb-md-0'>
              <ChartResolutionSelector
                isResponsive={true}
                value={range}
                onChange={(resolution) => {
                  searchParams.set('range', resolution.range);
                  setSearchParams(searchParams);
                }}
              />
            </div>
          </div>
        </div>
        <div>
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

          {dataReady === true && firstSeriesConfig && secondSeriesConfig && (
            <Chart.Composed
              seriesConfig={[firstSeriesConfig, secondSeriesConfig]}
              tooltip={{
                dateFormat: 'dd, MMM D YYYY'
              }}
              showLegend={true}
            ></Chart.Composed>
          )}
        </div>
      </section>
    </>
  );
};
