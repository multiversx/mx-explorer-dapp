import { formatTimestamp } from 'helpers/formatValue';
import { TransactionType } from 'types';

export const getLongestTxStreak = (transactions: TransactionType[]) => {
  if (transactions.length === 0) {
    return { streak: 0, startDay: undefined, endDay: undefined };
  }

  const days = [
    ...new Set(
      transactions.map((tx) => {
        const d = new Date(formatTimestamp(tx.timestamp));
        return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
      })
    )
  ];

  let maxLength = 1;
  let maxStart = days[0];
  let maxEnd = days[0];

  let currentLength = 1;
  let currentStart = days[0];

  for (let i = 1; i < days.length; i++) {
    if (days[i] === days[i - 1] + 1) {
      currentLength++;
    } else {
      currentLength = 1;
      currentStart = days[i];
    }

    if (currentLength > maxLength) {
      maxLength = currentLength;
      maxStart = currentStart;
      maxEnd = days[i];
    }
  }

  return {
    streak: maxLength,
    startDay: maxStart,
    endDay: maxEnd
  };
};
