import * as React from 'react';

import { faFilter } from '@fortawesome/pro-regular-svg-icons/faFilter';
import { faFilter as faFilterSolid } from '@fortawesome/pro-solid-svg-icons/faFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

import { SelectFilter } from 'components';
import { TxActionsEnum, TxFiltersEnum, TransactionsTableType } from 'types';

export const MethodColumnFilters = ({
  inactiveFilters = []
}: {
  inactiveFilters?: TransactionsTableType['inactiveFilters'];
}) => {
  const { search: locationSearch } = useLocation();
  const urlParams = new URLSearchParams(locationSearch);
  const { function: method } = Object.fromEntries(urlParams);

  const capitalize = (string: string) =>
    (string && string[0].toUpperCase() + string.slice(1)) || '';

  const searchMethods = (
    Object.keys(TxActionsEnum) as (keyof typeof TxActionsEnum)[]
  ).map((key) => {
    return {
      value: key,
      label: capitalize(TxActionsEnum[key])
    };
  });

  if (inactiveFilters && inactiveFilters.includes(TxFiltersEnum.method)) {
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
              {searchMethods.length > 0 && (
                <div className='filter-block'>
                  <div className='mb-1'>Method</div>
                  <SelectFilter
                    name='function-filter'
                    options={searchMethods}
                    filter={TxFiltersEnum.method}
                    placeholder='Search'
                    hasCustomSearch
                  />
                </div>
              )}
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
          icon={method !== undefined ? faFilterSolid : faFilter}
          className={method !== undefined ? 'text-primary' : ''}
        />
      </div>
    </OverlayTrigger>
  );
};
