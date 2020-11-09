import React from 'react';
import Chart, { ChartConfiguration } from 'chart.js';
import { faHeartRate } from '@fortawesome/pro-light-svg-icons/faHeartRate';
import { useGlobalState } from 'context';
import { PageState } from 'sharedComponents';

export interface RatingType {
  epoch: number;
  rating: number;
}

interface RatingsChartType {
  data: RatingType[];
  success: boolean | undefined;
}

interface ChartConfigType {
  labels: string[];
  data: number[];
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
  stepSize = 5,
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
          label: 'Rating',
          fill: 'start',
          data,
          backgroundColor,
          borderColor,
          pointBackgroundColor,
          pointHoverBackgroundColor: borderColor,
          borderWidth: 2,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      elements: {
        line: {
          tension: 0.38,
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
              color: gridLinesColor,
              drawOnChartArea: false,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              stepSize,
              fontColor: gridLabelsColor,
            },
            gridLines: {
              color: gridLinesColor,
              drawOnChartArea: false,
            },
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
        callbacks: {
          title: function title(tooltipItem) {
            const [item] = tooltipItem;

            return `Rating ${item.value}`;
          },
          label: function title(tooltipItem) {
            return `Epoch ${tooltipItem.label}`;
          },
        },
      },
      maintainAspectRatio: false,
    },
  };
};

const RatingsChart = ({ ratings }: { ratings: RatingsChartType }) => {
  const ref = React.useRef(null);
  const chartRef = React.useRef(null);
  const { theme } = useGlobalState();
  const [chart, setChart] = React.useState<any>();
  const [internalTheme, setInternalTheme] = React.useState(theme);

  const buildChart = (instance: any) => () => {
    if ((chartRef as any).current) {
      const docStyle = window.getComputedStyle(document.documentElement);
      const gridLinesColor = docStyle.getPropertyValue('--border-color');
      const gridLabelsColor = docStyle.getPropertyValue('--secondary');
      const borderColor = docStyle.getPropertyValue('--primary');
      const pointBackgroundColor = docStyle.getPropertyValue('--card-bg');
      const backgroundColor = docStyle.getPropertyValue('--chart-faded-bg');

      const config = chartConfig({
        labels: ratings.data.map(({ epoch }) => String(epoch)),
        data: ratings.data.map(({ rating }) => rating),
        stepSize: 1,
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
      const PriceChart = new Chart((chartRef as any).current, config);
      setChart(PriceChart);
    }
  };

  React.useEffect(buildChart(chart), []);

  const rebuildChart = () => {
    buildChart(chart);
  };

  const changeChartTheme = () => {
    setTimeout(() => {
      if (theme !== internalTheme) {
        buildChart(chart)();
        setInternalTheme(theme);
      }
    }, 100);
  };

  const forceChartRender = () => {
    window.addEventListener('resize', rebuildChart);
    return () => {
      window.removeEventListener('resize', rebuildChart);
    };
  };

  React.useEffect(forceChartRender, []);
  React.useEffect(changeChartTheme, [theme]);

  return (
    <div ref={ref} className="card" data-testid="chartContainer">
      {ratings.success === false && (
        <PageState
          icon={faHeartRate}
          title="Unable to load rating"
          className="page-state-sm d-flex h-100 align-items-center justify-content-center"
        />
      )}
      {ratings.success && (
        <>
          {ratings.data.length === 0 && (
            <PageState
              icon={faHeartRate}
              title="No rating"
              className="page-state-sm d-flex h-100 align-items-center justify-content-center"
            />
          )}
          {ratings.data.length > 0 && (
            <>
              <div className="card-header">
                <div className="card-header-item">
                  <h6 className="m-0">Rating History</h6>
                </div>
              </div>
              <div className="card-body p-0 pr-2">
                <div className="d-flex align-items-center justify-content-center flex-fill mt-2">
                  <canvas ref={chartRef} />
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default RatingsChart;
