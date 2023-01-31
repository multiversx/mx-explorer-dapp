import React, { useEffect, useRef, useState } from 'react';
import { faChartBar } from '@fortawesome/pro-regular-svg-icons/faChartBar';
import { useSelector } from 'react-redux';
import { PageState, Chart, Loader, useAdapter } from 'components';
import { ChartConfigType } from 'components/Chart/helpers/types';
import { activeNetworkSelector } from 'redux/selectors';
import { ChartResolutionSelector } from './components/ChartResolution';
import type { ChartResolutionRangeType } from './components/ChartResolution/types';
import { ChartListType } from '../AnalyticsCompare';
import { getChartColorPalette } from '../helpers/getChartColorPalette';

export interface AnalyticsChartDataType {
  value: string;
  timestamp: number;
}

export const AnalyticsChart = ({ series }: { series: ChartListType[] }) => {
  const ref = useRef(null);

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const [range, setRange] = useState<ChartResolutionRangeType>('month');

  const { getAnalyticsChart } = useAdapter();

  const [seriesConfig, setSeriesConfig] = useState<ChartConfigType[]>();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

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
        legendStyle: {
          color: color,
          borderColor: color
        }
      });
    });

    setSeriesConfig(configs);
  }, [seriesData, series]);

  return (
    <section id={[series.map((x) => x.id)].join('/')} ref={ref}>
      <div className='d-md-flex align-items-center flex-wrap mb-spacer mt-n3'>
        <h5 className='my-3 me-md-auto'>
          {seriesConfig?.map((sc, index) => (
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

        {dataReady === true && seriesConfig?.every((x) => x.data?.length > 0) && (
          <Chart.Composed
            seriesConfig={seriesConfig}
            tooltip={{
              dateFormat: 'dd, MMM D YYYY'
            }}
            showLegend={false}
          ></Chart.Composed>
        )}
      </div>
    </section>
  );
};
