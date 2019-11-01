import moment from 'moment';

export default function dateFormatted(value: number) {
  return moment(value * 1000).format('MMM DD, YYYY HH:mm:ss A');
}
