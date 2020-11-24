import moment from 'moment';

export function dhms(ms: number) {
  let days = Math.floor(ms / (24 * 60 * 60 * 1000));
  let daysms = ms % (24 * 60 * 60 * 1000);
  let hrs = Math.floor(daysms / (60 * 60 * 1000));
  let hrsms = daysms % (60 * 60 * 1000);
  let mins = Math.floor(hrsms / (60 * 1000));
  let minsms = hrsms % (60 * 1000);
  let secs = Math.floor(minsms / 1000);

  // let diff = ' ago';
  let diff = '';
  let secsString = secs + ' sec';
  let minsString = mins + ' min';
  let hrsString = hrs + ' hr';
  let daysString = days + ' day';

  if (secs > 1) secsString = secs + ' secs';
  if (mins > 1) minsString = mins + ' mins';
  if (hrs > 1) hrsString = hrs + ' hrs';
  if (days > 1) daysString = days + ' days';

  if (days >= 1) return daysString + ' ' + hrsString + diff;
  if (hrs >= 1) {
    const minutesString = mins === 0 ? '' : ' ' + minsString + diff;
    return hrsString + minutesString;
  }
  if (mins >= 1) {
    const secString = secs === 0 ? '' : ' ' + secsString + diff;
    return minsString + secString;
  }

  return secsString + diff;
}

export default function timeAgo(timestamp: number) {
  const dateNow = moment.utc();
  const txtTime = moment.utc(timestamp);
  const diffInMs = dateNow.diff(txtTime);

  return dhms(diffInMs);
}
