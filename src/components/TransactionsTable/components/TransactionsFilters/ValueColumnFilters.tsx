import React from 'react';
import { faFilter } from '@fortawesome/pro-regular-svg-icons';
import { faFilter as faFilterSolid } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

import { TokenSelectFilter } from 'components';
import { TransactionFiltersEnum } from 'types';

export const ValueColumnFilters = ({
  inactiveFilters = []
}: {
  inactiveFilters?: TransactionFiltersEnum[];
}) => {
  const [searchParams] = useSearchParams();
  const { token } = Object.fromEntries(searchParams);

  if (
    inactiveFilters &&
    inactiveFilters.includes(TransactionFiltersEnum.token)
  ) {
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
                  filter={TransactionFiltersEnum.token}
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
