import React, { useRef, useState } from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { useSearchParams } from 'react-router-dom';

export const timestampToDate = (timestamp: number | undefined) => {
  return timestamp ? moment.unix(timestamp).toDate() : null;
};

const hidePopover = () => {
  document.body.click();
};

export const getFilterText = (after: Date | null, before: Date | null) => {
  const dateFormat = 'DD MMM YYYY';
  const afterText =
    after !== null
      ? `${before !== null ? '' : 'After '}${moment(after).format(dateFormat)}`
      : '';
  const beforeText =
    before !== null ? ` - ${moment(before).format(dateFormat)}` : '';

  return `${afterText}${beforeText}`;
};

export const DateFilter = () => {
  const ref = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { before, after } = Object.fromEntries(searchParams);

  const afterDate = timestampToDate(Number(after));
  const beforeDate = timestampToDate(Number(before));

  const [startDate, setStartDate] = useState<Date | null>(afterDate);
  const [endDate, setEndDate] = useState<Date | null>(beforeDate);

  const onChange = (dates: [Date, Date]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const onClear = () => {
    setStartDate(null);
    setEndDate(null);
    hidePopover();

    const paramsObject = Object.fromEntries(searchParams);
    if (paramsObject['before']) {
      delete paramsObject['before'];
    }
    if (paramsObject['after']) {
      delete paramsObject['after'];
    }
    const nextUrlParams = {
      ...paramsObject
    };

    setSearchParams(nextUrlParams);
  };

  const onApply = () => {
    hidePopover();
    const paramsObject = Object.fromEntries(searchParams);
    const nextUrlParams = {
      ...paramsObject,
      ...(startDate !== null
        ? { after: moment.utc(startDate).unix().toString() }
        : {}),
      ...(endDate !== null
        ? { before: moment(endDate).endOf('day').utc().unix().toString() }
        : {})
    };

    setSearchParams(nextUrlParams);
  };

  const filterText = getFilterText(afterDate, beforeDate);

  return (
    <div
      ref={ref}
      className='transactions-datepicker d-flex flex-column align-items-center'
    >
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
      {before && after && filterText && <div>{filterText}</div>}
      <div className='d-flex justify-content-center mt-2 mb-3'>
        <button className='btn btn-primary btn-sm px-3 py-2' onClick={onApply}>
          Apply
        </button>
        <button
          className='btn btn-outline-primary btn-sm px-3 py-2 ms-2'
          onClick={onClear}
        >
          Clear
        </button>
      </div>
    </div>
  );
};
