import React from 'react';
import { faFilter } from 'icons/regular';
import { faFilter as faFilterSolid } from 'icons/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

import { SelectFilter } from 'components';
import { TransactionActionEnum, TransactionFiltersEnum } from 'types';

export const MethodColumnFilters = ({
  inactiveFilters = []
}: {
  inactiveFilters?: TransactionFiltersEnum[];
}) => {
  const [searchParams] = useSearchParams();
  const { function: method } = Object.fromEntries(searchParams);

  const capitalize = (string: string) =>
    (string && string[0].toUpperCase() + string.slice(1)) || '';

  const searchMethods = (
    Object.values(
      TransactionActionEnum
    ) as (keyof typeof TransactionActionEnum)[]
  )
    .filter((val, index, array) => array.indexOf(val) === index)
    .map((key) => {
      return {
        value: key,
        label: capitalize(TransactionActionEnum[key])
      };
    });

  if (
    inactiveFilters &&
    inactiveFilters.includes(TransactionFiltersEnum.method)
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
        <Popover id='popover-positioned-bottom' className='border popover-xs '>
          <Popover.Body>
            <div className='p-3 '>
              {searchMethods.length > 0 && (
                <div className='filter-block'>
                  <div className='mb-1'>Method</div>
                  <SelectFilter
                    name='function-filter'
                    options={searchMethods}
                    filter={TransactionFiltersEnum.method}
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
