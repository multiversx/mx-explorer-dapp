import moment from 'moment';

export const formatDate = (
  value: number,
  noSeconds?: boolean,
  utc?: boolean
) => {
  if (utc) {
    return moment
      .utc(value * 1000)
      .format(`MMM DD, YYYY HH:mm${noSeconds ? '' : ':ss'} UTC`);
  }
  return moment(value * 1000).format(
    `MMM DD, YYYY HH:mm${noSeconds ? '' : ':ss'}`
  );
};
