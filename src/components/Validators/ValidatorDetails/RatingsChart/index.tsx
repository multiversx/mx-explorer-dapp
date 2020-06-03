import * as React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

export interface HistoricRatingType {
  epoch: number;
  rating: number;
}

const RatingsChart = ({ historicRatings }: { historicRatings: HistoricRatingType[] }) => {
  console.warn(historicRatings);

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
        <h4>History</h4>
      </div>
      <div className="card">
        <Chart options={options} series={series} type="line" width="100%" height="152px" />
      </div>
    </div>
  );
};

export default RatingsChart;
