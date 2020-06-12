import * as React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import './chart.scss';
export interface HistoricRatingType {
  epoch: number;
  rating: number;
}

const RatingsChart = ({ historicRatings }: { historicRatings: HistoricRatingType[] }) => {
  const series = [
    {
      name: 'rating',
      data: historicRatings.map(rating => rating.rating),
    },
  ];
  const options: ApexOptions = {
    chart: {
      id: 'basic-bar',
      // background: '#fff',
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      enabled: true,
      // onDatasetHover: {
      //   highlightDataSeries: false,
      // },
      intersect: false,
      x: {
        show: false,
      },
      marker: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        formatter: function format(value) {
          return parseInt(String(value)).toString();
        },
      },
    },
    xaxis: {
      categories: historicRatings.map(rating => rating.epoch),
    },
  };

  return (
    <div data-testid="chartContainer">
      <div className="mt-4">
        <h4>Rating History</h4>
      </div>
      <div className="card pr-3">
        {process.env.NODE_ENV !== 'test' && (
          <Chart options={options} series={series} type="line" width="100%" height="152px" />
        )}
      </div>
    </div>
  );
};

export default RatingsChart;
