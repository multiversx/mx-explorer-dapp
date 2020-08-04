import React from 'react';
import ReactApexChart from 'react-apexcharts';

export default class ApexChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const options = {
      states: {
        hover: {
          filter: {
            type: 'none',
          },
        },
      },
      chart: {
        animations: {
          enabled: false,
        },
      },
      fill: {
        colors: ['#fff', '#6B87D7'],
      },
      tooltip: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          startAngle: 0,
          expandOnClick: false,
          offsetX: 0,
          offsetY: 0,
          customScale: 1,
          donut: {
            size: '80%',
            background: 'transparent',
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      responsive: [
        {
          breakpoint: undefined,
          options: {},
        },
      ],
      stroke: {
        show: false,
      },
    };

    return (
      <ReactApexChart
        options={options}
        // series={[this.props.claimableRewards, this.props.stake]}
        series={[this.props.claimableRewards * 10, this.props.stake]}
        type="donut"
        height={100}
      />
    );
  }
}
