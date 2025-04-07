import moment from 'moment';
import { formatTimestamp } from './formatTimestamp';

export const formatDate = (
  value: number,
  noSeconds?: boolean,
  utc?: boolean
) => {
  const formattedValue = formatTimestamp(value);

  if (utc) {
    return moment
      .utc(formattedValue)
      .format(`MMM DD, YYYY HH:mm${noSeconds ? '' : ':ss'} UTC`);
  }
  return moment(formattedValue).format(
    `MMM DD, YYYY HH:mm${noSeconds ? '' : ':ss'}`
  );
};
