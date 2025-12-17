import moment from 'moment';

import { formatTimestamp } from 'helpers/formatValue';
import { TransactionType } from 'types';

const toDayTimestamp = (day: number) => {
  return moment.utc(day * 86400 * 1000).format('ddd, MMM DD, YYYY');
};

export const getLongestTxStreak = (transactions: TransactionType[]) => {
  if (transactions.length === 0) {
    return { length: 0, startDay: null, endDay: null };
  }

  const days: Set<number> = new Set();
  for (const a of transactions) {
    days.add(Math.floor(formatTimestamp(a.timestamp) / 1000 / 86400));
  }

  let maxLen = 0;
  let maxStart = 0;

  for (const day of days) {
    if (!days.has(day - 1)) {
      let currentDay = day;
      let length = 1;

      while (days.has(currentDay + 1)) {
        currentDay++;
        length++;
      }

      if (length > maxLen) {
        maxLen = length;
        maxStart = day;
      }
    }
  }

  return {
    length: maxLen,
    startDay: toDayTimestamp(maxStart),
    endDay: toDayTimestamp(maxStart + maxLen - 1)
  };
};
