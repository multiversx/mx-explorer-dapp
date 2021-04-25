import React from 'react';
import moment from 'moment';
import Chart, { ChartConfiguration } from 'chart.js';

type ChartResponseType = { time: string; value: number }[];
type ChartType = 'lineWithVertical' | 'line' | 'bar';
type displayType = undefined | 'small' | 'price';
interface ChartConfigType {
  labels: string[];
  data: number[];
  min: number;
  stepSize: number;
  label: string;
  showYaxis: boolean;
  type: ChartType;
  aspectRatio: undefined | number;
  displayType: displayType;
  formatMoney: undefined | boolean;
  primaryColor: string;
  secondaryColor: string;
  mutedColor: string;
  borderColor: string;
  cardBackgroundColor: string;
  backgroundColor: string;
}

const formatValue = (value: string | number | undefined, formatUsd: boolean, compact: boolean) => {
  if (value) {
    value = parseFloat(String(value));
    let decimal;
    const units = ['k', 'm', 'b', 't'];
    const compactValue = (value: number) => {
      for (var i = units.length - 1; i >= 0; i--) {
        decimal = Math.pow(1000, i + 1);
        if (value <= -decimal || value >= decimal) {
          const displayValue = value / decimal;
          return (displayValue > 9 ? displayValue : displayValue.toFixed(1)) + units[i];
        }
      }
      return value;
    };
    const formattedValue = compact
      ? compactValue(value)
      : value.toLocaleString('en', {
          maximumFractionDigits: parseFloat(String(value)) > 1000 ? 0 : 2,
        });

    return `${formatUsd ? '$' : ''}${formattedValue}`;
  }
  return '';
};

const chartConfig = ({
  labels,
  data = [],
  min = 0,
  stepSize = 2,
  label = '',
  showYaxis = false,
  type = 'lineWithVertical',
  aspectRatio = 3.5,
  displayType,
  formatMoney = false,
  primaryColor,
  secondaryColor,
  mutedColor,
  borderColor,
  cardBackgroundColor,
  backgroundColor,
}: ChartConfigType): ChartConfiguration => {
  return {
    type,
    data: {
      labels,
      datasets: [
        {
          label,
          fill: 'start',
          data,
          backgroundColor,
          borderColor: type === 'bar' ? 'transparent' : primaryColor,
          pointBackgroundColor: cardBackgroundColor,
          pointHoverBackgroundColor: cardBackgroundColor,
          pointHoverBorderColor: primaryColor,
          hoverBackgroundColor: primaryColor,
          borderWidth: 1.5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio,
      elements: {
        line: {
          tension: 0.1,
        },
        point: {
          radius: 0,
          hitRadius: 4,
          hoverRadius: 3,
          borderColor: primaryColor,
        },
      },

      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            display: displayType !== 'small',
            ticks: {
              display: true,
              maxTicksLimit: 1,
              fontColor: mutedColor,
              fontSize: 10,
              minRotation: 0,
              maxRotation: 0,
              labelOffset: 8,
              padding: -6,
            },
            gridLines: { display: false },
          },
        ],
        yAxes: [
          {
            display: showYaxis,
            position: 'right',
            ticks: {
              maxTicksLimit: 7,
              stepSize,
              suggestedMin: min,
              fontColor: mutedColor,
              fontSize: 10,
              callback: (value) => {
                const formattedValue = formatValue(value, formatMoney, true);
                return formattedValue;
              },
            },
            gridLines: { display: false },
          },
        ],
      },
      tooltips: {
        mode: 'index',
        intersect: false,
        backgroundColor: cardBackgroundColor,
        titleAlign: 'center',
        titleFontColor: secondaryColor,
        titleFontSize: displayType === 'small' ? 9 : 11,
        titleFontStyle: '400',
        bodyAlign: 'center',
        bodyFontColor: secondaryColor,
        bodyFontSize: displayType === 'small' ? 8 : 9,
        bodyFontStyle: '300',
        borderColor,
        borderWidth: 1,
        xPadding: displayType === 'small' ? 10 : 15,
        yPadding: displayType === 'small' ? 4 : 15,
        custom: (tooltip) => {
          if (!tooltip) return;
          tooltip.displayColors = false;
        },
        callbacks: {
          label: (tooltipItem) => String(tooltipItem.xLabel),
          title: (tooltipItem) => {
            let formattedValue = `${
              formatMoney && displayType === 'price' ? '' : `${label}: `
            }${formatValue(tooltipItem[0].yLabel, formatMoney, false)}`;

            return formattedValue;
          },
        },
      },
      ...(displayType === 'small'
        ? {
            layout: {
              padding: {
                right: 36,
              },
            },
          }
        : {}),
    },
  };
};

const StatisticsChart = ({
  chartData,
  label,
  showYaxis,
  type,
  aspectRatio,
  displayType,
  formatMoney,
}: {
  chartData: ChartResponseType;
  label: string;
  showYaxis: boolean;
  type: ChartType;
  aspectRatio?: number;
  displayType?: displayType;
  formatMoney?: boolean;
}) => {
  const ref = React.useRef(null);
  const chartRef = React.useRef(null);

  const [chart, setChart] = React.useState<any>();

  const buildChart = (instance: any) => () => {
    if ((chartRef as any).current) {
      const docStyle = window.getComputedStyle(document.documentElement);
      const borderColor = docStyle.getPropertyValue('--border-color');
      const secondaryColor = docStyle.getPropertyValue('--secondary');
      const mutedColor = docStyle.getPropertyValue('--muted');
      const primaryColor = docStyle.getPropertyValue('--primary');
      const cardBackgroundColor = docStyle.getPropertyValue('--card-bg');
      const fadedBackground = docStyle.getPropertyValue('--chart-faded-bg');

      const chartElement = (chartRef as any).current.getContext('2d');
      let gradient = chartElement.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(31, 67, 244, 0.4)');
      gradient.addColorStop(0.32, 'rgba(31, 67, 244, 0.005)');
      gradient.addColorStop(1, 'rgba(31, 67, 244, 0)');

      const getBackgroundColor = () => {
        switch (true) {
          case type === 'bar' && displayType === 'small':
            return fadedBackground;
          case type === 'bar':
            return primaryColor;
          default:
            return gradient;
        }
      };
      const backgroundColor = getBackgroundColor();

      const config = chartConfig({
        labels: chartData.map(({ time }: { time: any }) => moment(time).format('D MMM YYYY')),
        data: chartData.map(({ value }: { value: any }) => value),
        min: Math.max(Math.round(Math.min(...chartData.map((q: any) => q.value)) - 2), 0),
        stepSize: 2,
        label,
        type,
        displayType,
        formatMoney,
        aspectRatio,
        showYaxis,
        primaryColor,
        secondaryColor,
        mutedColor,
        borderColor,
        cardBackgroundColor,
        backgroundColor,
      });

      if (instance) {
        instance.destroy();
      }

      if (type === 'lineWithVertical') {
        Chart.defaults.lineWithVertical = Chart.defaults.line;
        Chart.controllers.lineWithVertical = Chart.controllers.line.extend({
          draw: function (ease: any) {
            Chart.controllers.line.prototype.draw.call(this, ease);
            const ctx = this.chart.ctx;
            const bottomY = this.chart.chartArea.bottom;
            const rightX = this.chart.chartArea.right;
            if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
              const activePoint = this.chart.tooltip._active[0];
              const x = activePoint.tooltipPosition().x;
              const y = activePoint.tooltipPosition().y;
              ctx.save();
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.setLineDash([4, 4]);
              ctx.lineTo(x, bottomY);
              ctx.lineWidth = 1;
              ctx.strokeStyle = mutedColor;
              ctx.stroke();
              ctx.restore();
            }
            if (displayType !== 'small') {
              ctx.save();
              ctx.beginPath();
              ctx.moveTo(28, bottomY);
              ctx.lineTo(rightX, bottomY);
              ctx.lineWidth = 1;
              ctx.strokeStyle = mutedColor;
              ctx.stroke();
              ctx.restore();
            }
          },
        });
      }

      if (displayType !== 'small') {
        Chart.controllers.bar = Chart.controllers.bar.extend({
          draw: function (ease: any) {
            Chart.controllers.line.prototype.draw.call(this, ease);
            const ctx = this.chart.ctx;
            const bottomY = this.chart.chartArea.bottom;
            const rightX = this.chart.chartArea.right;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(28, bottomY);
            ctx.lineTo(rightX, bottomY);
            ctx.lineWidth = 0.8;
            ctx.strokeStyle = mutedColor;
            ctx.stroke();
            ctx.restore();
          },
        });
      }

      const newChart = new Chart((chartRef as any).current, config);
      setChart(newChart);
    }
  };

  React.useEffect(buildChart(chart), [chartData]);

  return (
    <div ref={ref} className="statistics-chart chart">
      {
        <>
          <div className="d-flex align-items-end justify-content-center flex-fill">
            <canvas ref={chartRef} />
          </div>
        </>
      }
    </div>
  );
};

export default StatisticsChart;
