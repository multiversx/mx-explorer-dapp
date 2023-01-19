import React from 'react';
import BigNumber from 'bignumber.js';
import { usdValue } from 'helpers';
import { useGlobalState } from 'context';
import moment from 'moment';
import denominate from 'sharedComponents/Denominate/denominate';

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
  currency,
  percentageMultiplier,
  denomination,
  customLabel,
  showUsdValue,
  dateFormat,
}: {
  active?: boolean;
  payload?: any;
  label?: any;
  currency?: string;
  percentageMultiplier?: number;
  denomination?: number;
  customLabel?: string;
  showUsdValue?: boolean;
  dateFormat?: string;
}) => {
  const { usd } = useGlobalState();

  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <ul className="recharts-tooltip-item-list list-unstyled">
          {payload.map((entry: any) => {
            let displayValue = entry.value;
            if (denomination) {
              const denominatedValue = denominate({
                input: new BigNumber(displayValue).toString(10),
                denomination,
                decimals: 2,
                showLastNonZeroDecimal: false,
                addCommas: false,
              });

              displayValue = denominatedValue;
            }
            if (percentageMultiplier) {
              displayValue = Number(displayValue) * percentageMultiplier;
            }

            return (
              <li key={entry.name}>
                {getTooltipLabel(entry.name)
                  ? `${getTooltipLabel(entry.name)}: `
                  : customLabel
                  ? `${getTooltipLabel(customLabel)}: `
                  : ''}
                <span
                  style={{ color: payload.length > 1 ? entry.color : '' }}
                  className="item-value"
                >
                  {currency === '$' ? '$' : ''}
                  {currency === '$'
                    ? new BigNumber(displayValue).toFormat(2)
                    : new BigNumber(displayValue).toFormat()}{' '}
                  {currency !== '$' ? currency : ''}
                </span>
                {showUsdValue && (
                  <p className="text-secondary small mb-0">
                    {usdValue({ amount: displayValue, usd, showPrefix: true })}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
        <div className="recharts-tooltip-label">
          {payload[0]?.payload?.timestamp
            ? moment
                .unix(payload[0].payload.timestamp)
                .utc()
                .format(dateFormat ?? 'D MMM YYYY')
            : label}
        </div>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
