import React from 'react';
import { faCircleBolt } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

import { useFetchGrowthSearch } from 'hooks';
import { growthSearchSelector } from 'redux/selectors';
import { WithClassnameType, TrendEnum } from 'types';

export const ActiveAccountsHeroPill = ({ className }: WithClassnameType) => {
  const { activeAccountsToday } = useSelector(growthSearchSelector);

  useFetchGrowthSearch();

  return (
    <div
      className={`hero-pill active-accounts-hero-pill d-flex align-items-center ${
        className ?? ''
      }`}
    >
      <FontAwesomeIcon icon={faCircleBolt} className='text-primary-200 me-2' />
      <div className='d-flex flex-column lext-left'>
        <div className='label text-primary'>{activeAccountsToday}</div>
        <div className='description'>Active Accounts Today</div>
      </div>
    </div>
  );
};
