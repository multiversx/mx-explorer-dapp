import React, { useEffect, useRef, useState } from 'react';
import { faChartBar } from '@fortawesome/pro-regular-svg-icons/faChartBar';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { PageState, Chart, Loader, useAdapter } from 'components';
import { ChartConfigType } from 'components/Chart/helpers/types';
import { activeNetworkSelector } from 'redux/selectors';
import { ChartResolutionRangeType } from './components/ChartResolution';
import { ChartListType } from '../Analytics';
import { RANGE } from '../constants';
import { getChartColorPalette } from '../helpers/getChartColorPalette';

export interface AnalyticsChartDataType {
  value: string;
  timestamp: number;
}

export const AnalyticsChart = ({ charts }: { charts: ChartListType[] }) => {
  const ref = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const range = searchParams.get(RANGE) as ChartResolutionRangeType;

  const { getAnalyticsChart } = useAdapter();

  const [seriesConfig, setSeriesConfig] = useState<ChartConfigType[]>();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

  const [seriesData, setSeriesData] = useState<{
    [seriesId: string]: AnalyticsChartDataType[];
  }>({});

  const getData = async () => {
    const paths = charts.map((chart) => chart.path);
    const promises = paths.map((path) =>
      getAnalyticsChart(`${path}?range=${range}`)
    );

    const promisesResult = await Promise.allSettled(promises);
    let dataReady = true;

    const seriesData = promisesResult.reduce(
      (acc, currentValue, currentIndex) => {
        if (currentValue.status === 'fulfilled' && currentValue.value.success) {
          acc[charts[currentIndex].id] = currentValue.value.data?.data;
        } else {
          acc[charts[currentIndex].id] = [];
          dataReady = false;
        }
        return acc;
      },
      {} as { [seriesId: string]: AnalyticsChartDataType[] }
    );

    setSeriesData(seriesData);
    setDataReady(dataReady);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getData();
  }, [activeNetworkId, range, charts]);

  useEffect(() => {
    const configs: ChartConfigType[] = [];
    const colorPalette = getChartColorPalette();

    charts.forEach((chart, i) => {
      const color = colorPalette[(i % colorPalette.length) - 1];

      configs.push({
        id: chart.id,
        label: chart.label,
        data: seriesData[chart.id],
        yAxisConfig: {
          ...chart.dappConfig,
          orientation: 'left'
        },
        gradient: `${chart.id}-gradient`,
        gradientStopColor: color,
        stroke: color,
        legendStyle: {
          color: color,
          borderColor: color
        }
      });
    });

    setSeriesConfig(configs);
  }, [seriesData, charts]);

  return (
    <section id={[charts.map((x) => x.id)].join('/')} ref={ref}>
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
          <Chart.ComposedMultiple
            seriesConfig={seriesConfig}
            tooltip={{
              dateFormat: 'dd, MMM D YYYY'
            }}
          ></Chart.ComposedMultiple>
        )}
      </div>
    </section>
  );
};
