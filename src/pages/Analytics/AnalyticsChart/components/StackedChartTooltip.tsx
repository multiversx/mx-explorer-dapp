import React from 'react';
import { formatAmount } from '@multiversx/sdk-dapp/utils';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { capitalize, usdValue } from 'helpers';
import { economicsSelector } from 'redux/selectors';
import { ChartConfigType } from '../../../../components/Chart/helpers/types';

export const StackedChartTooltip = ({
  seriesConfig,
  active,
  payload,
  label,
  customLabel,
  dateFormat
}: {
  seriesConfig: ChartConfigType[];
  active?: boolean;
  payload?: any;
  label?: any;
  customLabel?: string;
  dateFormat?: string;
}) => {
  const { isFetched, unprocessed } = useSelector(economicsSelector);

  if (active && payload && payload.length && isFetched) {
    return (
      <div className='custom-tooltip'>
        <div className='recharts-tooltip-label text-neutral-200'>
          <span>
            {' '}
            {payload[0]?.payload?.timestamp
              ? moment
                  .unix(payload[0].payload.timestamp)
                  .utc()
                  .format(dateFormat ?? 'D MMM YYYY')
              : label}
          </span>
        </div>

        <ul className='recharts-tooltip-item-list list-unstyled'>
          {payload.map((entry: any) => {
            let displayValue = entry.value;

            const currentSeries = seriesConfig.find(
              (x) => x.id === entry.dataKey
            );

            if (currentSeries?.yAxisConfig?.decimals) {
              displayValue = formatAmount({
                input: new BigNumber(displayValue).toString(10),
                decimals: currentSeries?.yAxisConfig?.decimals,
                digits: 2,
                showLastNonZeroDecimal: false,
                addCommas: false
              });
            }
            if (currentSeries?.yAxisConfig?.percentageMultiplier) {
              displayValue =
                Number(displayValue) *
                currentSeries?.yAxisConfig?.percentageMultiplier;
            }

            return (
              <li
                key={entry.name}
                style={{ textAlign: 'start' }}
                className='d-flex flex-column'
              >
                <span className='item-label'>
                  {`${
                    customLabel
                      ? capitalize(customLabel)
                      : capitalize(entry.name)
                  } `}
                </span>

                <span
                  style={{ color: payload.length > 1 ? entry.color : '' }}
                  className='item-value'
                >
                  {currentSeries?.yAxisConfig?.currency === '$' ? '$' : ''}
                  {currentSeries?.yAxisConfig?.currency === '$'
                    ? new BigNumber(displayValue).toFormat(2)
                    : new BigNumber(displayValue).toFormat()}
                  {currentSeries?.yAxisConfig?.currency &&
                  currentSeries?.yAxisConfig?.currency !== '$'
                    ? ` ${currentSeries?.yAxisConfig?.currency}`
                    : ''}
                  {currentSeries?.yAxisConfig?.percentageMultiplier ? '%' : ''}
                </span>

                {currentSeries?.showUsdValue && (
                  <p className='text-neutral-400 small mb-0'>
                    {usdValue({
                      amount: displayValue,
                      usd: unprocessed.price,
                      showPrefix: true
                    })}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return null;
};
