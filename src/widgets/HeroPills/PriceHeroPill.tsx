import React from 'react';
import {
  faCircleUp,
  faCircleDown,
  faCircleMinus
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

import { useFetchGrowthSearch } from 'hooks';
import { growthSearchSelector } from 'redux/selectors';
import { WithClassnameType, TrendEnum } from 'types';

export const PriceHeroPill = ({ className }: WithClassnameType) => {
  const { currentPrice, priceChange24h, priceChangeTrend } =
    useSelector(growthSearchSelector);

  const trendIcon = new Map([
    [TrendEnum.up, faCircleUp],
    [TrendEnum.down, faCircleDown],
    [TrendEnum.neutral, faCircleMinus]
  ]);

  useFetchGrowthSearch();

  return (
    <div
      className={`hero-pill price-hero-pill d-flex align-items-center font-primary-medium ${
        className ?? ''
      }`}
    >
      <FontAwesomeIcon
        icon={trendIcon.get(priceChangeTrend) || faCircleMinus}
        className='text-primary-200 me-2'
      />
      <div className='d-flex flex-column lext-left'>
        <div
          className='label text-primary cursor-context'
          title={priceChange24h}
        >
          {currentPrice}
        </div>
        <div className='description'>Current Price</div>
      </div>
    </div>
  );
};
