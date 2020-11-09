import React from 'react';
import Chart from 'chart.js';
import { useGlobalState } from 'context';

const labels = ['Elapsed', 'Remaining'];
const colors = ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.5)'];

const chartConfig = {
  type: 'doughnut',
  data: {
    labels,
    datasets: [
      {
        data: [100, 0],
        backgroundColor: colors,
        hoverBackgroundColor: colors,
      },
    ],
  },
  options: {
    cutoutPercentage: 85,
    elements: {
      arc: {
        borderWidth: 0,
        hoverBorderWidth: 0,
        borderColor: colors[0],
        hoverBorderColor: colors[0],
        // borderColor: '#6B87D7',
        // hoverBorderColor: '#6B87D7',
      },
    },
    legend: {
      display: false,
    },
    animation: {
      duration: 0,
      animateRotate: false,
    },
    hover: {
      animationDuration: 0,
    },
    responsiveAnimationDuration: 0,
    maintainAspectRatio: false,
    tooltips: {
      enabled: false,
    },
  },
};

const DelegationChart = ({
  claimableRewards,
  stake,
}: {
  claimableRewards: number;
  stake: number;
}) => {
  const ref = React.useRef(null);
  const chartRef = React.useRef(null);
  const { theme } = useGlobalState();

  const [chart, setChart] = React.useState<any>();
  const [internalTheme, setInternalTheme] = React.useState<any>(theme);

  const buildChart = (instance: any) => () => {
    if ((chartRef as any).current) {
      const config = chartConfig;

      // const docStyle = window.getComputedStyle(document.documentElement);
      // const bg = docStyle.getPropertyValue('--card-bg');
      // const elapsed = docStyle.getPropertyValue('--primary');
      // const remaining = docStyle.getPropertyValue('--light');
      const [elapsed] = colors;

      config.data.datasets[0].backgroundColor = colors;
      config.data.datasets[0].hoverBackgroundColor = colors;
      config.options.elements.arc.borderColor = elapsed;
      config.options.elements.arc.hoverBorderColor = elapsed;

      // config.options.animation.duration = 450;
      // config.options.animation.animateRotate = true;

      config.data.datasets[0].data = [claimableRewards, stake];

      if (instance) {
        instance.destroy();
      }

      // eslint-disable-next-line
      const newChart = new Chart((chartRef as any).current, config);
      setChart(newChart);
    }
  };

  React.useEffect(buildChart(chart), []);

  const rebuildChart = () => {
    setTimeout(() => {
      buildChart(chart);
    });
  };

  const forceChartRender = () => {
    window.addEventListener('resize', rebuildChart);
    return () => {
      window.removeEventListener('resize', rebuildChart);
    };
  };

  const changeChartTheme = () => {
    setTimeout(() => {
      if (theme !== internalTheme) {
        buildChart(chart)();
        setInternalTheme(theme);
      }
    }, 100);
  };

  React.useEffect(forceChartRender, []);
  React.useEffect(changeChartTheme, [theme]);

  return (
    <div
      ref={ref}
      className="rewards text-secondary text-center d-flex flex-column justify-content-around h-100"
    >
      <div className="wrapper">
        <canvas ref={chartRef} height={100} />
      </div>
    </div>
  );
};

export default DelegationChart;
