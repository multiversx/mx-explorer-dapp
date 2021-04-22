import moment from 'moment';

export default function dateFormatted(value: number, noSeconds?: boolean) {
  return moment(value * 1000).format(`MMM DD, YYYY HH:mm${noSeconds ? '' : ':ss'} A`);
}
