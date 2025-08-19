import BigNumber from 'bignumber.js';
import moment from 'moment';
import { useSelector } from 'react-redux';
import {
  capitalize,
  formatAmount,
  formatBigNumber,
  getColors,
  usdValue
} from 'helpers';
import { economicsSelector } from 'redux/selectors';
import { ChartConfigType } from './helpers/types';

export const ChartTooltip = ({
  seriesConfig,
  active,
  payload,
  label,
  customLabel,
  dateFormat,
  color,
  stacked,
  stackedLabel,
  totalValueStacked
}: {
  seriesConfig: ChartConfigType[];
  active?: boolean;
  payload?: any;
  label?: any;
  customLabel?: string;
  dateFormat?: string;
  color?: string;
  stacked?: boolean;
  stackedLabel?: string;
  totalValueStacked?: string | number;
}) => {
  const { isFetched, unprocessed } = useSelector(economicsSelector);

  const stackedLabelColor = getColors(['white']);

  const formattedTotalValueStacked = new BigNumber(
    totalValueStacked ?? '0'
  ).isInteger()
    ? new BigNumber(totalValueStacked ?? '0').toFormat()
    : new BigNumber(totalValueStacked ?? '0').toFormat(2);

  if (active && payload && payload.length && isFetched) {
    const data = payload.sort(
      (alpha: any, beta: any) => beta.value - alpha.value
    );

    return (
      <div className='analytics-custom-tooltip'>
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
          {stacked && (
            <li
              key={'total-staked-value'}
              style={{ textAlign: 'start' }}
              className='d-flex flex-column'
            >
              <span className='item-label'>
                {capitalize(stackedLabel ?? '')}
              </span>

              <span style={{ color: stackedLabelColor }} className='item-value'>
                {formattedTotalValueStacked}
              </span>
            </li>
          )}
          {data.map((entry: any) => {
            let displayValue = entry.value;

            const currentSeries = seriesConfig.find(
              (x) => x.id === entry.dataKey
            );

            if (currentSeries?.yAxisConfig?.decimals) {
              displayValue = formatAmount({
                input: new BigNumber(displayValue).toString(10),
                decimals: currentSeries?.yAxisConfig?.decimals,
                digits: 2
              });
            }
            if (currentSeries?.yAxisConfig?.percentageMultiplier) {
              displayValue = new BigNumber(
                Number(displayValue) *
                  currentSeries?.yAxisConfig?.percentageMultiplier
              ).toFormat(2);
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
                  style={{
                    color:
                      payload.length > 1 ? entry.color : color ?? entry.color
                  }}
                  className='item-value'
                >
                  {currentSeries?.yAxisConfig?.currency === '$' ? '$' : ''}
                  {formatBigNumber({ value: displayValue })}
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
                      usd: currentSeries?.price ?? unprocessed.price,
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
