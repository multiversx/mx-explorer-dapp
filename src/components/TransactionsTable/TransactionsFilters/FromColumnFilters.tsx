import React from 'react';

import { faFilter } from '@fortawesome/pro-regular-svg-icons/faFilter';
import { faFilter as faFilterSolid } from '@fortawesome/pro-solid-svg-icons/faFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

import { SearchFilter } from 'components';
import { TxFiltersEnum, TransactionsTableType } from 'types';

export const FromColumnFilters = ({
  inactiveFilters = []
}: {
  inactiveFilters?: TransactionsTableType['inactiveFilters'];
}) => {
  const [searchParams] = useSearchParams();
  const { sender } = Object.fromEntries(searchParams);

  if (inactiveFilters && inactiveFilters.includes(TxFiltersEnum.sender)) {
    return null;
  }

  return (
    <OverlayTrigger
      trigger='click'
      key='popover'
      placement='bottom'
      rootClose
      overlay={
        <Popover id='popover-positioned-bottom' className='border popover-xs '>
          <Popover.Body>
            <div className='p-3 '>
              <div className='filter-block'>
                <div className='mb-1'>From</div>
                <SearchFilter
                  name='sender-filter'
                  filter={TxFiltersEnum.sender}
                  placeholder='Address'
                  validation='address'
                />
              </div>
            </div>
          </Popover.Body>
        </Popover>
      }
    >
      <div
        className='d-inline-block side-action cursor-pointer'
        data-testid='StatusFilterButton'
      >
        <FontAwesomeIcon
          icon={sender !== undefined ? faFilterSolid : faFilter}
          className={sender !== undefined ? 'text-primary' : ''}
        />
      </div>
    </OverlayTrigger>
  );
};
