import * as React from 'react';
import { faChartBar } from '@fortawesome/pro-regular-svg-icons/faChartBar';
import { StatisticsChart, Loader, PageState, adapter } from 'sharedComponents';
import { useGlobalState } from 'context';

const GrowthBlock = ({
  title,
  value,
  description,
  color,
  size,
}: {
  title: string;
  value: string;
  description?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const ref = React.useRef(null);
  // const { activeNetworkId } = useGlobalState();

  let colSize = '';
  switch (size) {
    case 'sm':
      colSize = 'col-12 col-sm-4 col-lg-2';
      break;
    case 'md':
      colSize = 'col-12 col-sm-4 col-lg-3';
      break;
    case 'lg':
      colSize = 'col-12 col-sm-4 col-lg-4';
      break;
    default:
      colSize = 'col-12 col-lg-6';
      break;
  }

  return (
    <div className={`growth-block ${colSize}`}>
      <div
        className={`card shadow-sm d-flex align-items-center justify-content-center ${
          color ? `card-${color}` : ''
        }`}
        ref={ref}
      >
        <div className="mb-3 title">{title}</div>
        <div className="mb-3 value">{value}</div>
        {description && <div className="mb-3 description">{description}</div>}
      </div>
    </div>
  );
};

export default GrowthBlock;
