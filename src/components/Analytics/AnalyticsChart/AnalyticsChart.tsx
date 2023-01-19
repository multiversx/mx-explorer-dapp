import React, { useEffect, useRef, useState } from 'react';
import { PageState, Chart, Loader, adapter } from 'sharedComponents';
import { useGlobalState } from 'context';

import { ChartListType } from '../Analytics';

import { faChartBar } from '@fortawesome/pro-regular-svg-icons/faChartBar';
import { ChartConfigType } from 'sharedComponents/Chart/helpers/types';

export interface AnalyticsChartDataType {
  value: string;
  timestamp: number;
}
export interface AnalyticsChartType {
  id: string;
  data: AnalyticsChartDataType[];
}

export const AnalyticsChart = ({ id, path }: ChartListType) => {
  const ref = useRef(null);

  const { activeNetworkId } = useGlobalState();
  const { getAnalyticsChart } = adapter();

  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [chart, setChart] = useState<AnalyticsChartDataType[]>([]);

  // Temporary ?
  const formatChartNameFomId = (id: string) => {
    const normalizedName = id.replace('-monthly', '').replaceAll('-', ' ');

    return normalizedName;
  };

  const formatChartLabelFomId = (id: string) => {
    const normalizedName = id.replace('-monthly', '').replace('daily-', '').replaceAll('-', ' ');

    return normalizedName;
  };

  const config: ChartConfigType[] = [
    {
      id: formatChartLabelFomId(id),
      label: formatChartLabelFomId(id),
      gradient: 'defaultGradient',
      data: chart,
    },
  ];

  const getData = () => {
    getAnalyticsChart(path).then((chart) => {
      if (chart.success) {
        const chartData = chart?.data;

        if (chartData?.data) {
          setChart(chartData.data);
        }
      }
      setDataReady(chart.success);
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(getData, [activeNetworkId]);

  return (
    <>
      <section id={id} ref={ref} className="card">
        <Chart.Heading title={formatChartNameFomId(id)} className="text-capitalize"></Chart.Heading>
        <Chart.Body>
          {dataReady === undefined && <Loader />}
          {dataReady === false && (
            <PageState
              icon={faChartBar}
              title="Unable to load Chart"
              className="py-spacer my-auto"
              titleClassName="mt-0"
              dataTestId="accountsChartError"
            />
          )}
          {dataReady === true && chart.length === 0 && (
            <PageState
              icon={faChartBar}
              title="Missing Chart data"
              className="py-spacer my-auto"
              titleClassName="mt-0"
              dataTestId="accountsChartError"
            />
          )}

          {dataReady === true && chart.length > 0 && (
            <Chart.Bar {...{ config }} hasOnlyStartEndTick></Chart.Bar>
          )}
        </Chart.Body>
      </section>
    </>
  );
};
