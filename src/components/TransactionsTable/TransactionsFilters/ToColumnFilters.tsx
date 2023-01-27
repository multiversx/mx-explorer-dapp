import React from 'react';

import { faFilter } from '@fortawesome/pro-regular-svg-icons/faFilter';
import { faFilter as faFilterSolid } from '@fortawesome/pro-solid-svg-icons/faFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

import { SelectFilter, SelectFilterType } from 'components';
import { truncateMiddle } from 'helpers';
import { TxFiltersEnum, TransactionsTableType } from 'types';

export const ToColumnFilters = ({
  inactiveFilters = []
}: {
  inactiveFilters?: TransactionsTableType['inactiveFilters'];
}) => {
  const [searchParams] = useSearchParams();
  const { receiver } = Object.fromEntries(searchParams);

  const existingValues: SelectFilterType['options'] =
    receiver?.split(',').map((receiver) => {
      return { value: receiver, label: truncateMiddle(receiver, 9) };
    }) ?? [];

  if (inactiveFilters && inactiveFilters.includes(TxFiltersEnum.receiver)) {
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
                <div className='mb-1'>To</div>
                <SelectFilter
                  name='receiver-filter'
                  options={existingValues}
                  filter={TxFiltersEnum.receiver}
                  placeholder='Search for multiple addresses'
                  validation='address'
                  noOptionsMessage='Invalid Address'
                  hasCustomSearch
                  isMulti
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
          icon={receiver !== undefined ? faFilterSolid : faFilter}
          className={receiver !== undefined ? 'text-primary' : ''}
        />
      </div>
    </OverlayTrigger>
  );
};
