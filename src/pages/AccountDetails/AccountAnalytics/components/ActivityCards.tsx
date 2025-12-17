import { useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import { FormatNumber, Overlay, TimeAgo } from 'components';
import { formatBigNumber, formatTimestamp, getLongestTxStreak } from 'helpers';
import { accountExtraSelector, accountSelector } from 'redux/selectors';
import { StatsCard } from 'widgets';

export const ActivityCards = () => {
  const { account } = useSelector(accountSelector);
  const { accountExtra } = useSelector(accountExtraSelector);
  const { txCount } = account;
  const { accountTransactions, firstTransactionDate } = accountExtra;

  const canGenerateAnalytics =
    txCount && accountTransactions.length === txCount;

  const uniqueDays = new Set(
    accountTransactions.map((tx) => {
      const d = new Date(formatTimestamp(tx.timestamp));
      return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
    })
  );
  const { length, startDay, endDay } = getLongestTxStreak(accountTransactions);

  return (
    <div className='stats-cards equal-width d-flex flex-row flex-wrap gap-3 mb-spacer'>
      <StatsCard
        className='border'
        title='Transaction Count'
        value={formatBigNumber({ value: txCount })}
      />
      <StatsCard
        className='border'
        title='Active Since'
        value={
          firstTransactionDate ? (
            <TimeAgo value={firstTransactionDate} tooltip short showAgo />
          ) : (
            ELLIPSIS
          )
        }
      />
      {canGenerateAnalytics && (
        <>
          <StatsCard
            className='border'
            title='Unique Days Active'
            value={formatBigNumber({ value: uniqueDays.size })}
          />
          <StatsCard
            className='border'
            title='Longest Streak'
            value={
              startDay && endDay && length > 1 ? (
                <Overlay
                  title={
                    <>
                      <p className='mb-0'>Started on: {startDay}</p>
                      <p className='mb-0'>Until: {endDay}</p>
                    </>
                  }
                >
                  <FormatNumber value={length} /> Days
                </Overlay>
              ) : (
                <>
                  <FormatNumber value={length} /> Days
                </>
              )
            }
          />
        </>
      )}
    </div>
  );
};
