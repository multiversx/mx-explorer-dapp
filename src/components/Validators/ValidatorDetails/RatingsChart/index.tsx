import * as React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const RatingsChart = () => {
  const series = [
    {
      name: 'series-1',
      data: [30, 40, 45, 50, 49, 60, 70, 91],
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
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
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
