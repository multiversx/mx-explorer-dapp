import moment from 'moment';
import { dhms } from '../timeAgo';
import timeAgo from '../timeAgo';

describe('TimeAgo tests', () => {
  test('Display only minutes when seconds are zero', async () => {
    const txTime = moment();
    const time = moment().add(5, 'minutes');
    const diffInMs = time.diff(txTime);

    expect(dhms(diffInMs)).toBe('5 mins');
  });
  test('Display only hours when minutes are zero', async () => {
    const txTime = moment();
    const time = moment().add(5, 'hours');
    const diffInMs = time.diff(txTime);

    expect(dhms(diffInMs)).toBe('5 hrs');
  });
  test('Display zero seconds when diff is negative', async () => {
    const txTime = moment().add(5, 'minutes').unix();
    expect(timeAgo(txTime * 1000)).toBe('0 sec');
  });
});
