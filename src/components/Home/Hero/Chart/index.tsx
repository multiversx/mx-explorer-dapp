import React from 'react';
import { Chart } from 'chart.js';
import moment from 'moment';
import { useGlobalState } from '../../../../context';
import { getLastTransactionsCount } from './helpers/asyncRequests';
import { addValueToChart } from './helpers/chartHelpers';

type ChartType = {
  liveTps: number;
};

let myChart: any;
let requestsCount = 1;

// TODO: renunt la cele 20 de date initiale
// TODO: ma uit de ce se tot pune labelul
// TODO: incerc sa pun restul de setari

const HeroChart = ({ liveTps }: ChartType) => {
  let ref = React.useRef(null);
  // let myChart = React.useRef();

  const {
    activeTestnet: { elasticUrl, refreshRate: activeRoundTime },
    timeout,
    refresh: { timestamp },
  } = useGlobalState();
  let initialValuesCount = 0;
  const initialValues: number[] = [];

  // componentDidMount
  React.useEffect(() => {
    if (ref.current !== null) {
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
    let prePopulateCount = 20;
    let roundTime = activeRoundTime / 1000;
    let dataLag = 2 * roundTime;

    let date = new Date();
    let epoch = Math.floor(date.getTime() / 1000);
    /* eslint-disable no-undef */
    for (let i = prePopulateCount + 1; i > 1; i--) {
      let start = epoch - dataLag - i * roundTime;
      let end = epoch - dataLag - i * roundTime + roundTime;

      // getLastTransactionsCount({ elasticUrl, start, end, timeout }).then(({ count }) => {
      // initialValuesCount++;
      // initialValues[i] = Math.floor(count / roundTime);

      if (initialValuesCount === 20) {
        for (let i = 21; i > 1; i--) {
          let dataLag = 2 * roundTime * 1000;
          let myTime = new Date().getTime() - dataLag - i * roundTime + roundTime;
          // requestsCount = addValueToChart(initialValues[i], myTime, requestsCount, myChart);
          requestsCount = addValueToChart(0, myTime, requestsCount, myChart);
        }
      }
      // });
    }
  }, []);

  React.useEffect(() => {
    if (ref.current !== null && myChart !== undefined) {
      requestsCount = addValueToChart(liveTps, new Date().getTime(), requestsCount, myChart);
      // if (swallowReturnedValue) return;
    }
  }, [liveTps, timestamp]);

  return <canvas ref={ref} />;
};

export default HeroChart;
