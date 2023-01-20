import React, { useRef } from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { useHistory, useLocation } from 'react-router-dom';

import { useNetworkPathname } from 'helpers';

export const timestampToDate = (timestamp: number | undefined) => {
  return timestamp ? moment.unix(timestamp).toDate() : null;
};

const hidePopover = () => {
  document.body.click();
};

export const getFilterText = (after: Date | null, before: Date | null) => {
  const dateFormat = 'DD MMM YYYY';
  const afterText =
    after !== null ? `${before !== null ? '' : 'After '}${moment(after).format(dateFormat)}` : '';
  const beforeText = before !== null ? ` - ${moment(before).format(dateFormat)}` : '';

  return `${afterText}${beforeText}`;
};

export const DateFilter = () => {
  const ref = useRef(null);

  const history = useHistory();
  const { search: locationSearch } = useLocation();
  const networkPathname = useNetworkPathname();
  const urlParams = new URLSearchParams(locationSearch);
  const { before, after } = Object.fromEntries(urlParams);

  const afterDate = timestampToDate(Number(after));
  const beforeDate = timestampToDate(Number(before));

  const [startDate, setStartDate] = React.useState<Date | null>(afterDate);
  const [endDate, setEndDate] = React.useState<Date | null>(beforeDate);

  const onChange = (dates: [Date, Date]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const onClear = () => {
    setStartDate(null);
    setEndDate(null);
    hidePopover();

    const paramsObject = Object.fromEntries(urlParams);
    if (paramsObject['before']) {
      delete paramsObject['before'];
    }
    if (paramsObject['after']) {
      delete paramsObject['after'];
    }
    const nextUrlParams = new URLSearchParams({
      ...paramsObject,
    }).toString();
    history.push(`${networkPathname}?${nextUrlParams}`);
  };

  const onApply = () => {
    const paramsObject = Object.fromEntries(urlParams);
    const nextUrlParams = new URLSearchParams({
      ...paramsObject,
      ...(startDate !== null ? { after: moment.utc(startDate).unix().toString() } : {}),
      ...(endDate !== null ? { before: moment(endDate).endOf('day').utc().unix().toString() } : {}),
    }).toString();
    history.push(`${networkPathname}?${nextUrlParams}`);
  };

  const filterText = getFilterText(afterDate, beforeDate);

  return (
    <div ref={ref} className="transactions-datepicker d-flex flex-column align-items-center">
      <DatePicker
        selected={startDate}
        startDate={startDate}
        endDate={endDate}
        onChange={onChange}
        selectsRange
        inline
        maxDate={new Date()}
        showDisabledMonthNavigation
      />
      {before && after && filterText && <div className="mb-3 text-body">{filterText}</div>}
      <div className="d-flex justify-content-center mb-3">
        <button className="btn btn-primary btn-sm" onClick={onApply}>
          Apply
        </button>
        <button className="btn btn-outline-primary btn-sm ml-2" onClick={onClear}>
          Clear
        </button>
      </div>
    </div>
  );
};
