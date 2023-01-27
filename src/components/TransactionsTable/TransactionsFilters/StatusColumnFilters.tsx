import * as React from 'react';

import { faFilter } from '@fortawesome/pro-regular-svg-icons/faFilter';
import { faFilter as faFilterSolid } from '@fortawesome/pro-solid-svg-icons/faFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

import { SelectFilter, SearchFilter } from 'components';
import { ApiTxStatusEnum, TxFiltersEnum, TransactionsTableType } from 'types';

export const StatusColumnFilters = ({
  inactiveFilters = []
}: {
  inactiveFilters?: TransactionsTableType['inactiveFilters'];
}) => {
  const { search: locationSearch } = useLocation();
  const urlParams = new URLSearchParams(locationSearch);

  const { status, miniBlockHash } = Object.fromEntries(urlParams);

  const searchStatuses = (
    Object.keys(ApiTxStatusEnum) as (keyof typeof ApiTxStatusEnum)[]
  ).map((key) => {
    return {
      value: key,
      label: ApiTxStatusEnum[key]
    };
  });

  if (
    inactiveFilters &&
    inactiveFilters.includes(TxFiltersEnum.status) &&
    inactiveFilters.includes(TxFiltersEnum.miniBlockHash)
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
              {!inactiveFilters.includes(TxFiltersEnum.status) && (
                <>
                  {searchStatuses.length > 0 && (
                    <div className='filter-block'>
                      <div className='mb-1'>Status</div>
                      <SelectFilter
                        name='status-filter'
                        options={searchStatuses}
                        filter={TxFiltersEnum.status}
                      />
                    </div>
                  )}
                </>
              )}

              {!inactiveFilters.includes(TxFiltersEnum.miniBlockHash) && (
                <div className='filter-block'>
                  <div className='mb-1'>Miniblock Hash</div>
                  <SearchFilter
                    name='miniBlockHash-filter'
                    filter={TxFiltersEnum.miniBlockHash}
                    placeholder='Hash'
                    validation='hash'
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
          icon={
            status !== undefined || miniBlockHash !== undefined
              ? faFilterSolid
              : faFilter
          }
          className={
            status !== undefined || miniBlockHash !== undefined
              ? 'text-primary'
              : ''
          }
        />
      </div>
    </OverlayTrigger>
  );
};
