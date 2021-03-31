import React from 'react';
import moment from 'moment';
import Chart, { ChartConfiguration } from 'chart.js';
import * as ChartAnnotation from 'chartjs-plugin-annotation';
import { faHeartRate } from '@fortawesome/pro-light-svg-icons/faHeartRate';
import { faCaretUp } from '@fortawesome/pro-solid-svg-icons/faCaretUp';
import { faCaretDown } from '@fortawesome/pro-solid-svg-icons/faCaretDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ChartConfigType {
  labels: string[];
  data: number[];
  min: number;
  stepSize: number;
  lastValue: number;
  primaryColor: string;
  secondaryColor: string;
  borderColor: string;
  cardColor: string;
  backgroundColor: string;
}

const chartConfig = ({
  labels,
  data = [],
  min = 0,
  stepSize = 2,
  lastValue = 0,
  primaryColor,
  secondaryColor,
  borderColor,
  cardColor,
  backgroundColor,
}: ChartConfigType): ChartConfiguration => {
  return {
    type: 'lineWithVertical',
    plugins: [ChartAnnotation],
    data: {
      labels,
      datasets: [
        {
          label: 'USD',
          fill: 'start',
          data,
          backgroundColor,
          borderColor: primaryColor,
          pointBackgroundColor: cardColor,
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
              fontColor: secondaryColor,
            },
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            id: 'left-y-axis',
            ticks: {
              stepSize,
              min,
              fontColor: secondaryColor,
            },
            gridLines: { display: false },
          },
        ],
      },
      tooltips: {
        mode: 'index',
        intersect: false,
        backgroundColor: cardColor,
        titleAlign: 'center',
        titleFontColor: secondaryColor,
        titleFontSize: 10,
        titleFontStyle: '400',
        bodyAlign: 'center',
        bodyFontColor: secondaryColor,
        bodyFontSize: 12,
        bodyFontStyle: '500',
        borderColor,
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        custom: (tooltip) => {
          if (!tooltip) return;
          tooltip.displayColors = false;
        },
      },
      annotation: {
        annotations: [
          {
            type: 'line',
            mode: 'horizontal',
            value: lastValue,
            scaleID: 'left-y-axis',
            drawTime: 'afterDatasetsDraw',
            borderColor: secondaryColor,
            borderWidth: 1,
            borderDash: [4, 4],
            borderDashOffset: 1,
          },
        ],
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
      const borderColor = docStyle.getPropertyValue('--border-color');
      const secondaryColor = docStyle.getPropertyValue('--secondary');
      const primaryColor = docStyle.getPropertyValue('--primary');
      const cardColor = docStyle.getPropertyValue('--card-bg');
      const backgroundColor = docStyle.getPropertyValue('--chart-faded-bg');

      const config = chartConfig({
        labels: feed.map(({ time }: { time: any }) => moment(time).format('MMM D')),
        data: feed.map(({ value }: { value: any }) => value),
        min: Math.max(Math.round(Math.min(...feed.map((q: any) => q.value)) - 2), 0),
        stepSize: timeframe === 'week' ? 1 : 2,
        lastValue: feed[feed.length - 1].value,
        primaryColor,
        secondaryColor,
        borderColor,
        cardColor,
        backgroundColor,
      });

      if (instance) {
        instance.destroy();
      }

      Chart.defaults.lineWithVertical = Chart.defaults.line;
      Chart.controllers.lineWithVertical = Chart.controllers.line.extend({
        draw: function (ease: any) {
          Chart.controllers.line.prototype.draw.call(this, ease);

          if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
            const activePoint = this.chart.tooltip._active[0],
              ctx = this.chart.ctx,
              x = activePoint.tooltipPosition().x,
              topY = this.chart.legend.bottom,
              bottomY = this.chart.chartArea.bottom;

            // draw line
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, topY);
            ctx.setLineDash([4, 4]);
            ctx.lineTo(x, bottomY);
            ctx.lineWidth = 1;
            ctx.strokeStyle = secondaryColor;
            ctx.stroke();
            ctx.restore();
          }
        },
      });

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
