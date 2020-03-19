import { Chart } from 'chart.js';
import React from 'react';
import { useGlobalState } from '../../../../context';
import { addValueToChart } from './helpers/chartHelpers';

interface ChartType {
  liveTps: number;
}

let myChart: any;
let requestsCount = 1;

const HeroChart = ({ liveTps }: ChartType) => {
  const ref = React.useRef(null);

  const {
    activeTestnet: { refreshRate: activeRoundTime },
    refresh: { timestamp },
  } = useGlobalState();
  let initialValuesCount = 0;

  const initTable = () => {
    if (ref.current !== null) {
      myChart = undefined;

      myChart = new Chart(ref.current!, {
        type: 'line',
        data: {
          labels: [],

          datasets: [
            {
              data: [],
              borderWidth: 2,
              fill: false,
              borderColor: 'rgba(255,255,255,.7)',
              pointRadius: 0,
            },
          ],
        },
        options: {
          responsive: true,
          legend: {
            display: false,
          },
          tooltips: {
            mode: 'index',
            intersect: false,
            displayColors: false,
          },
          maintainAspectRatio: false,
          scales: {
            xAxes: [
              {
                gridLines: {
                  display: false,
                  offsetGridLines: true,
                },
                ticks: {
                  fontColor: 'rgba(255,255,255,.6)',
                  autoSkip: false,
                  maxRotation: 0,
                  minRotation: 0,
                },
                scaleLabel: {
                  display: false,
                  labelString: 'Time',
                  fontColor: 'rgba(255,255,255,.6)',
                },
              },
            ],
            yAxes: [
              {
                gridLines: {
                  color: 'rgba(255,255,255,.1)',
                  zeroLineColor: 'rgba(255,255,255,.2)',
                },
                ticks: {
                  fontColor: 'rgba(255,255,255,.6)',
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });
    }
    const prePopulateCount = 20;
    const roundTime = activeRoundTime / 1000;

    for (let i = prePopulateCount + 1; i > 1; i--) {
      initialValuesCount++;

      if (initialValuesCount === 20) {
        for (let i = 21; i > 1; i--) {
          const dataLag = 2 * roundTime * 1000;
          const myTime = new Date().getTime() - dataLag - i * roundTime + roundTime;
          requestsCount = addValueToChart(0, myTime, requestsCount, myChart);
        }
      }
    }

    return function cleanup() {
      ref.current = null;
      requestsCount = 1;
      myChart.destroy();
    };
  };

  // componentDidMount
  React.useEffect(initTable, []);

  React.useEffect(() => {
    if (ref.current !== null && myChart !== undefined) {
      requestsCount = addValueToChart(liveTps, new Date().getTime(), requestsCount, myChart);
      // if (swallowReturnedValue) return;
    }
  }, [liveTps, timestamp]);

  return <canvas ref={ref} />;
};

export default HeroChart;
