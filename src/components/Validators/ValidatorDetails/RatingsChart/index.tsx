import * as React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { faStarHalfAlt } from '@fortawesome/pro-regular-svg-icons/faStarHalfAlt';
import { PageState } from 'sharedComponents';
export interface HistoricRatingType {
  epoch: number;
  rating: number;
}

const RatingsChart = ({ historicRatings }: { historicRatings: HistoricRatingType[] }) => {
  const ratings = historicRatings ? historicRatings : [];
  const series = [
    {
      name: 'rating',
      data: ratings.map((rating) => rating.rating),
    },
  ];
  const options: ApexOptions = {
    chart: {
      id: 'basic-bar',
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      enabled: true,
      intersect: false,
      x: {
        show: false,
      },
      y: {
        formatter: function format(value, { series, seriesIndex, dataPointIndex, w }) {
          const rating = parseInt(String(value)).toString();
          return `${rating}, epoch ${ratings[dataPointIndex].epoch}`;
        },
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
      tickPlacement: 'between',
      categories: ratings.map((rating) => rating.epoch),
      labels: {
        rotate: 0,
        formatter: function format(value) {
          if (ratings.length > 20) {
            return parseInt(value) % 5 === 0 ? value : '';
          }
          return value;
        },
      },
    },
  };

  return (
    <div className="card card-small" data-testid="chartContainer">
      {ratings.length === 0 && (
        <PageState
          icon={faStarHalfAlt}
          title="No historic ratings found"
          className="page-state-sm d-flex h-100 align-items-center justify-content-center"
          dataTestId="roundsErrorScreen"
        />
      )}

      {ratings.length > 0 && (
        <>
          <div className="card-header border-0 p-0">
            <div className="card-header-item border-bottom p-3">
              <h6 className="m-0">Rating History</h6>
            </div>
          </div>
          <div className="card-body p-0 pr-2">
            {process.env.NODE_ENV !== 'test' && (
              <Chart options={options} series={series} type="line" width="100%" height="152px" />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RatingsChart;
