import React from 'react';
import { faFilter } from '@fortawesome/pro-regular-svg-icons';
import { faFilter as faFilterSolid } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

import { DateFilter } from 'components';
import { TransactionFiltersEnum } from 'types';

export const AgeColumnFilters = ({
  inactiveFilters = []
}: {
  inactiveFilters?: TransactionFiltersEnum[];
}) => {
  const [searchParams] = useSearchParams();
  const { before, after } = Object.fromEntries(searchParams);

  if (
    inactiveFilters &&
    inactiveFilters.includes(TransactionFiltersEnum.before) &&
    inactiveFilters.includes(TransactionFiltersEnum.after)
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
        <Popover id='popover-positioned-bottom' className='border '>
          <Popover.Body className='p-0'>
            <DateFilter />
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
            before !== undefined || after !== undefined
              ? faFilterSolid
              : faFilter
          }
          className={
            before !== undefined || after !== undefined ? 'text-primary' : ''
          }
        />
      </div>
    </OverlayTrigger>
  );
};
