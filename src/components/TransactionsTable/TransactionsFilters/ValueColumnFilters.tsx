import React from 'react';

import { faFilter } from '@fortawesome/pro-regular-svg-icons/faFilter';
import { faFilter as faFilterSolid } from '@fortawesome/pro-solid-svg-icons/faFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

import { TokenSelectFilter } from 'components';
import { TxFiltersEnum, TransactionsTableType } from 'types';

export const ValueColumnFilters = ({
  inactiveFilters = []
}: {
  inactiveFilters?: TransactionsTableType['inactiveFilters'];
}) => {
  const [searchParams] = useSearchParams();
  const { token } = Object.fromEntries(searchParams);

  if (inactiveFilters && inactiveFilters.includes(TxFiltersEnum.token)) {
    return null;
  }

  return (
    <OverlayTrigger
      trigger='click'
      key='popover'
      placement='bottom'
      rootClose
      overlay={
        <Popover
          id='popover-positioned-bottom'
          className='border popover-md multiple-select'
        >
          <Popover.Body>
            <div className='p-3 '>
              <div className='filter-block'>
                <div className='mb-1'>Token</div>
                <TokenSelectFilter
                  name='token-filter'
                  filter={TxFiltersEnum.token}
                  placeholder='Search for a Token'
                  noOptionsMessage='Invalid Identifier'
                />
              </div>
            </div>
          </Popover.Body>
        </Popover>
      }
    >
      <div
        className='d-inline-block side-action cursor-pointer'
        data-testid='valueFilterButton'
      >
        <FontAwesomeIcon
          icon={token !== undefined ? faFilterSolid : faFilter}
          className={token !== undefined ? 'text-primary' : ''}
        />
      </div>
    </OverlayTrigger>
  );
};