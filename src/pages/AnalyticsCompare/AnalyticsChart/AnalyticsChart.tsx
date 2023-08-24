import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { PageState, Chart, Loader } from 'components';
import {
  ChartConfigType,
  ChartListType,
  StackedChartConfig
} from 'components/Chart/helpers/types';
import { useAdapter } from 'hooks';
import { faChartBar } from 'icons/regular';
import { activeNetworkSelector } from 'redux/selectors';

import { ChartResolutionSelector } from './components/ChartResolution';
import { ChartResolutionRangeType } from './components/ChartResolution/types';

import { getChartColorPalette } from '../helpers/getChartColorPalette';

export interface AnalyticsChartDataType {
  value: string;
  timestamp: number;
}

export const AnalyticsChart = ({
  series,
  title,
  stacked,
  stackedLabel,
  customDomain
}: {
  series: ChartListType[];
  title?: string;
} & StackedChartConfig) => {
  const ref = useRef(null);

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const [range, setRange] = useState<ChartResolutionRangeType>('month');

  const { getAnalyticsChart } = useAdapter();

  const [seriesConfig, setSeriesConfig] = useState<ChartConfigType[]>();
  const [dataReady, setDataReady] = useState<boolean | undefined>();

  const [seriesData, setSeriesData] = useState<{
    [seriesId: string]: AnalyticsChartDataType[];
  }>({});

  const getData = async () => {
    const paths = series.map((chart) => chart.path);
    const promises = paths.map((path) =>
      getAnalyticsChart(`${path}?range=${range}`)
    );

    const promisesResult = await Promise.allSettled(promises);
    let dataReady = true;

    const seriesData = promisesResult.reduce(
      (acc, currentValue, currentIndex) => {
        if (currentValue.status === 'fulfilled' && currentValue.value.success) {
          acc[series[currentIndex].id] = currentValue.value.data?.data;
        } else {
          acc[series[currentIndex].id] = [];
          dataReady = false;
        }
        return acc;
      },
      {} as { [seriesId: string]: AnalyticsChartDataType[] }
    );

    setSeriesData(seriesData);
    setDataReady(dataReady);
  };

  useEffect(() => {
    getData();
  }, [activeNetworkId, range, series]);

  useEffect(() => {
    const configs: ChartConfigType[] = [];
    const colorPalette = getChartColorPalette();

    series.forEach((chartSeries, i) => {
      const color = colorPalette[i % colorPalette.length];

      configs.push({
        id: chartSeries.label,
        label: chartSeries.label,
        data: seriesData[chartSeries.id],
        yAxisConfig: {
          orientation: 'left',
          ...chartSeries.dappConfig
        },
        gradient: `${chartSeries.id}-gradient`,
        gradientStopColor: color,
        stroke: color,
        legend: {
          style: chartSeries?.legend?.style ?? {
            color: color,
            borderColor: color
          },
          config: {
            label: chartSeries?.legend?.config?.label ?? chartSeries.label
          }
        }
      });
    });

    setSeriesConfig(configs);
  }, [seriesData, series]);

  return (
    <section id={[series.map((x) => x.id)].join('/')} ref={ref}>
      <div className='d-md-flex align-items-center flex-wrap mb-spacer mt-n3'>
        <h5 className='my-3 me-md-auto'>
          {title
            ? title
            : seriesConfig?.map((sc, index) => (
                <React.Fragment key={`${sc.id}-config-label`}>
                  <span>{sc.label}</span>
                  {index !== seriesConfig?.length - 1 && (
                    <span className='mx-2'>/</span>
                  )}
                </React.Fragment>
              ))}
        </h5>
        <div className='d-flex justify-md-content-end align-items-center ms-auto me-0 mt-3 mt-md-0'>
          <div className='mb-0'>
            <ChartResolutionSelector
              isResponsive={true}
              value={range}
              onChange={(resolution) => {
                setRange(resolution.range);
              }}
            />
          </div>
        </div>
      </div>
      <div>
        {!seriesConfig || (dataReady === undefined && <Loader />)}
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
          seriesConfig?.some((x) => x.data?.length === 0) && (
            <PageState
              icon={faChartBar}
              title='Missing Chart data'
              className='py-spacer my-auto'
              titleClassName='mt-0'
              dataTestId='accountsChartError'
            />
          )}

        {dataReady === true &&
          seriesConfig?.every((x) => x.data?.length > 0) && (
            <Chart.Composed
              seriesConfig={seriesConfig}
              tooltip={{
                dateFormat: 'dd, MMM D YYYY'
              }}
              showLegend={true}
              stacked={stacked}
              stackedLabel={stackedLabel}
              customDomain={customDomain}
            />
          )}
      </div>
    </section>
  );
};
