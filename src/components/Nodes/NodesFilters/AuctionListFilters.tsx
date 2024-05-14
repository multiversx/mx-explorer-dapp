import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { Led } from 'components';
import { faSearch, faTimes } from 'icons/regular';
import { stakeSelector } from 'redux/selectors';
import { formatBigNumber } from 'helpers';

export interface AuctionListFiltersUIType {
  onlySearch?: boolean;
}

export const AuctionListFilters = ({
  onlySearch
}: AuctionListFiltersUIType) => {
  const {
    unprocessed: {
      qualifiedAuctionValidators,
      notQualifiedAuctionValidators,
      dangerZoneValidators,
      auctionValidators
    }
  } = useSelector(stakeSelector);

  const [searchParams, setSearchParams] = useSearchParams();

  const { search, isAuctionDangerZone, isQualified } =
    Object.fromEntries(searchParams);
  const [inputValue, setInputValue] = useState<string>(search);

  const changeValidatorValue: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    setInputValue(e.target.value);
  };

  const updateSearchValue = (searchValue: string) => {
    const { search, page, size, ...rest } = Object.fromEntries(searchParams);
    const nextUrlParams = {
      ...rest,
      ...(searchValue ? { search: searchValue } : {})
    };

    setSearchParams(nextUrlParams);
  };

  const resetFiltersLink = () => {
    const {
      isQualified,
      isAuctionDangerZone,
      search,
      page,
      sort,
      order,
      ...rest
    } = Object.fromEntries(searchParams);
    const nextUrlParams = {
      ...rest
    };

    setSearchParams(nextUrlParams);
  };

  const nodeQualifiedLink = (isQualified: boolean) => {
    const { isAuctionDangerZone, page, ...rest } =
      Object.fromEntries(searchParams);
    const nextUrlParams = {
      ...rest,
      ...(isQualified !== undefined ? { isQualified: String(isQualified) } : {})
    };

    setSearchParams(nextUrlParams);
  };

  const nodeDangerZoneLink = (isAuctionDangerZone: boolean) => {
    const { isQualified, page, ...rest } = Object.fromEntries(searchParams);
    const nextUrlParams = {
      ...rest,
      ...(isAuctionDangerZone
        ? { isAuctionDangerZone: 'true', isQualified: 'true' }
        : {})
    };

    setSearchParams(nextUrlParams);
  };

  const isAllActive = [search, isQualified, isAuctionDangerZone].every(
    (el) => el === undefined
  );

  return (
    <div className='filters d-flex align-items-start align-items-md-center justify-content-md-between flex-column flex-md-row gap-3'>
      <h5 className='table-title d-flex align-items-center' data-testid='title'>
        Nodes
      </h5>
      {!onlySearch && (
        <menu className='list-inline m-0 d-flex flex-wrap gap-2'>
          <li className='list-inline-item me-0'>
            <button
              type='button'
              onClick={() => {
                resetFiltersLink();
              }}
              className={classNames(
                'btn btn-tab d-flex align-items-center gap-1',
                { active: isAllActive }
              )}
            >
              All
              {auctionValidators !== undefined && (
                <span className='badge badge-sm'>
                  {formatBigNumber({ value: auctionValidators })}
                </span>
              )}
            </button>
          </li>
          <li className='list-inline-item me-0'>
            <button
              type='button'
              onClick={() => {
                nodeQualifiedLink(true);
              }}
              className={classNames(
                'btn btn-tab d-flex align-items-center gap-1',
                { active: isQualified === 'true' && !isAuctionDangerZone }
              )}
            >
              <Led color='bg-green-400' />
              Qualified{' '}
              {qualifiedAuctionValidators !== undefined && (
                <span className='badge badge-sm'>
                  {formatBigNumber({ value: qualifiedAuctionValidators })}
                </span>
              )}
            </button>
          </li>
          {Boolean(notQualifiedAuctionValidators) && (
            <li className='list-inline-item me-0'>
              <button
                type='button'
                onClick={() => {
                  nodeDangerZoneLink(true);
                }}
                className={classNames(
                  'btn btn-tab d-flex align-items-center gap-1',
                  { active: isAuctionDangerZone }
                )}
              >
                <Led color='bg-orange-400' />
                Danger Zone
                {dangerZoneValidators !== undefined && (
                  <span className='badge badge-sm'>
                    {formatBigNumber({ value: dangerZoneValidators })}
                  </span>
                )}
              </button>
            </li>
          )}
          <li className='list-inline-item me-0'>
            <button
              type='button'
              onClick={() => {
                nodeQualifiedLink(false);
              }}
              className={classNames(
                'btn btn-tab d-flex align-items-center gap-1',
                { active: isQualified === 'false' }
              )}
            >
              <Led color='bg-red-400' />
              Not Qualified
              {notQualifiedAuctionValidators !== undefined && (
                <span className='badge badge-sm'>
                  {formatBigNumber({ value: notQualifiedAuctionValidators })}
                </span>
              )}
            </button>
          </li>
        </menu>
      )}
      <div role='search' className={onlySearch ? 'search-lg' : 'search-sm'}>
        <div className='input-group input-group-sm input-group-seamless'>
          <input
            type='text'
            className='form-control'
            value={inputValue || ''}
            onChange={changeValidatorValue}
            onKeyDown={(keyEvent: React.KeyboardEvent) => {
              if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
                updateSearchValue(inputValue);
              }
            }}
            placeholder='Search'
            name='validatorSearch'
            data-testid='validatorSearch'
          />

          {inputValue ? (
            <button
              type='reset'
              className='input-group-text'
              onClick={() => {
                updateSearchValue('');
                setInputValue('');
              }}
              data-testid='resetSearch'
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          ) : (
            <button type='submit' className='input-group-text'>
              <FontAwesomeIcon icon={faSearch} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
