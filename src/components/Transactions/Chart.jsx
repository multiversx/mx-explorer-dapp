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
        colors: ['#6b8ffb', '#1b46c2'],
      },
      tooltip: {
        enabled: false,
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: '70%',
          },
        },
        pie: {
          startAngle: 0,
          expandOnClick: false,
          offsetX: 0,
          offsetY: 12,
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
      stroke: {
        show: false,
      },
    };

    return (
      <ReactApexChart
        options={options}
        series={[this.props.claimableRewards, this.props.stake]}
        type="donut"
        height={100}
      />
    );
  }
}
