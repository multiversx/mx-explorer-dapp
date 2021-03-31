import React from 'react';
import moment from 'moment';
import Chart, { ChartConfiguration } from 'chart.js';
import { faHeartRate } from '@fortawesome/pro-light-svg-icons/faHeartRate';
import { faCaretUp } from '@fortawesome/pro-solid-svg-icons/faCaretUp';
import { faCaretDown } from '@fortawesome/pro-solid-svg-icons/faCaretDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ChartConfigType {
  labels: string[];
  data: number[];
  min: number;
  stepSize: number;
  gridLinesColor: string;
  gridLabelsColor: string;
  borderColor: string;
  pointBackgroundColor: string;
  backgroundColor: string;
}

const chartConfig = ({
  labels,
  data = [],
  min = 0,
  stepSize = 2,
  gridLinesColor,
  gridLabelsColor,
  borderColor,
  pointBackgroundColor,
  backgroundColor,
}: ChartConfigType): ChartConfiguration => {
  return {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'USD',
          fill: 'start',
          data,
          backgroundColor,
          borderColor,
          pointBackgroundColor,
          pointHoverBackgroundColor: borderColor,
          borderWidth: 1.5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
      elements: {
        line: {
          tension: 0.38,
        },
        point: {
          radius: 4,
          hoverRadius: 5,
        },
      },

      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            ticks: {
              callback(tick: any, index: any) {
                return index % stepSize === 0 ? tick : '';
              },
              fontColor: gridLabelsColor,
            },
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              stepSize,
              min,
              fontColor: gridLabelsColor,
            },
            gridLines: { display: false },
          },
        ],
      },
      tooltips: {
        mode: 'index',
        intersect: false,
        custom: (tooltip) => {
          if (!tooltip) return;
          tooltip.displayColors = false;
        },
      },
    },
  };
};

type TimeFrameType = 'week' | 'month';

const StatisticsChart = ({ chartData }: { chartData: any }) => {
  const ref = React.useRef(null);
  const chartRef = React.useRef(null);

  const [chart, setChart] = React.useState<any>();
  const [timeframe, setTimeframe] = React.useState<TimeFrameType>('week');

  const lastValue = chartData[chartData.length - 1].value;
  const penultimateValue = chartData[chartData.length - 2].value;
  const direction = lastValue > penultimateValue ? 'up' : 'down';
  const percent = Math.abs(((lastValue - penultimateValue) / penultimateValue) * 100);

  const buildChart = (instance: any) => () => {
    if ((chartRef as any).current) {
      const feed =
        timeframe === 'week' ? chartData.slice(chartData.length - 7, chartData.length) : chartData;
      const docStyle = window.getComputedStyle(document.documentElement);
      const gridLinesColor = docStyle.getPropertyValue('--border-color');
      const gridLabelsColor = docStyle.getPropertyValue('--secondary');
      const borderColor = docStyle.getPropertyValue('--primary');
      const pointBackgroundColor = docStyle.getPropertyValue('--card-bg');
      const backgroundColor = docStyle.getPropertyValue('--chart-faded-bg');

      const config = chartConfig({
        labels: feed.map(({ time }: { time: any }) => moment(time).format('MMM D')),
        data: feed.map(({ value }: { value: any }) => value),
        min: Math.max(Math.round(Math.min(...feed.map((q: any) => q.value)) - 2), 0),
        stepSize: timeframe === 'week' ? 1 : 2,
        gridLinesColor,
        gridLabelsColor,
        borderColor,
        pointBackgroundColor,
        backgroundColor,
      });

      if (instance) {
        instance.destroy();
      }

      // eslint-disable-next-line
      const chart = new Chart((chartRef as any).current, config);
      setChart(chart);
    }
  };

  React.useEffect(buildChart(chart), [chartData]);

  const setChartTimeframe = (newTimeFrame: TimeFrameType) => () => {
    setTimeframe(newTimeFrame);
    buildChart(chart)();
  };

  return (
    <div ref={ref} className="statistics-chart chart h-100 d-flex flex-column">
      {
        <>
          <div className="py-2 row d-flex flex-column flex-sm-row justify-content-between">
            <div className="col d-flex align-items-center pl-3 pt-3">
              <>
                <FontAwesomeIcon icon={faHeartRate} className="text-primary" />
                &nbsp;
                <span className="text-secondary">{lastValue}</span>
                <span className={direction === 'up' ? 'text-success' : 'text-danger'}>
                  &nbsp;
                  <FontAwesomeIcon icon={direction === 'up' ? faCaretUp : faCaretDown} />
                  &nbsp;
                  {percent && percent.toFixed(2)}%
                </span>
              </>
            </div>

            <div className="col pt-3 text-left text-sm-right">
              <div className="btn-group btn-group-sm btn-group-toggle" data-toggle="buttons">
                <label
                  onClick={setChartTimeframe('week')}
                  className={`btn btn-white ${timeframe === 'week' ? 'active' : ''}`}
                >
                  <input type="radio" name="options" id="week" />
                  Week
                </label>
                <label
                  onClick={setChartTimeframe('month')}
                  className={`btn btn-white ${timeframe === 'month' ? 'active' : ''}`}
                >
                  <input type="radio" name="options" id="month" />
                  Month
                </label>
              </div>
            </div>
          </div>

          <div className="mt-3 d-flex align-items-center justify-content-center flex-fill">
            <canvas ref={chartRef} />
          </div>
        </>
      }
    </div>
  );
};

export default StatisticsChart;
