import React from 'react';

const getTooltipLabel = (label: string) => {
  const capitalize = (string: string) =>
    (string && string[0].toUpperCase() + string.slice(1)) || '';

  if (!label) {
    return '';
  }

  switch (label.toLowerCase()) {
    case 'nolabel':
    case 'value':
      return '';

    case 'volume':
      return 'Volume';

    case 'total':
      return 'Total';
    case 'totaladdresses':
      return 'Total Addresses';
    case 'totalstaked':
      return 'Total Staked';

    default:
      return capitalize(label);
  }
};

const CustomTooltip = ({
  active,
  payload,
  label,
  isUsd,
  customLabel,
  isEGLD,
}: {
  active?: boolean;
  payload?: any;
  label?: any;
  isUsd?: boolean;
  isEGLD?: boolean;
  customLabel?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <ul className="recharts-tooltip-item-list list-unstyled">
          {payload.map((entry: any) => (
            <li key={entry.name}>
              {getTooltipLabel(entry.name)
                ? `${getTooltipLabel(entry.name)}: `
                : customLabel
                ? `${getTooltipLabel(customLabel)}: `
                : ''}
              <span style={{ color: payload.length > 1 ? entry.color : '' }} className="item-value">
                {isUsd ? '$' : ''}
                {Number(entry.value).toLocaleString(undefined)}
                {isEGLD ? ' EGLD' : ''}
              </span>
            </li>
          ))}
        </ul>
        <div className="recharts-tooltip-label">
          {payload[0]?.payload?.time ? payload[0].payload.time : label}
        </div>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
