import moment from 'moment';
import denominate from './denominate';

const filters = {
  truncate: function truncate(
    text: string | undefined,
    length: number,
    end: string | undefined = '...'
  ) {
    if (isNaN(length)) length = 10;

    if (!end) end = '...';

    if (text !== undefined && (text.length <= length || text.length - end.length <= length)) {
      return text;
    } else {
      return String(text).substring(0, length - end.length) + end;
    }
  },
  sizeFormat: function(size: number): string {
    if (isNaN(size)) return size.toString();
    let s = size / 1000;
    return s.toFixed(3) + ' kB';
  },
  timestampAge: function(timestamp: number) {
    function dhms(ms: number) {
      let days = Math.floor(ms / (24 * 60 * 60 * 1000));
      let daysms = ms % (24 * 60 * 60 * 1000);
      let hrs = Math.floor(daysms / (60 * 60 * 1000));
      let hrsms = daysms % (60 * 60 * 1000);
      let mins = Math.floor(hrsms / (60 * 1000));
      let minsms = hrsms % (60 * 1000);
      let secs = Math.floor(minsms / 1000);

      let diff = ' ago';
      let secsString = secs + ' sec';
      let minsString = mins + ' min';
      let hrsString = hrs + ' hr';
      let daysString = days + ' day';

      if (secs > 1) secsString = secs + ' secs';
      if (mins > 1) minsString = mins + ' mins';
      if (hrs > 1) hrsString = hrs + ' hrs';
      if (days > 1) daysString = days + ' days';

      if (days >= 1) return daysString + ' ' + hrsString + diff;
      if (hrs >= 1) return hrsString + ' ' + minsString + diff;
      if (mins >= 1) return minsString + ' ' + secsString + diff;

      return secsString + diff;
    }

    let dateNow = moment.utc();
    let txtTime = moment.utc(timestamp);
    let diffInMs = dateNow.diff(txtTime);
    return dhms(diffInMs);
  },
  denominate,
};

export default filters;
