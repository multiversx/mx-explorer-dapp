import * as React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

import { faFilter } from '@fortawesome/pro-regular-svg-icons/faFilter';
import { faFilter as faFilterSolid } from '@fortawesome/pro-solid-svg-icons/faFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { TxFiltersEnum, TransactionsTableType } from 'types';
import { DateFilter } from 'components';

export const AgeColumnFilters = ({
  inactiveFilters = [],
}: {
  inactiveFilters?: TransactionsTableType['inactiveFilters'];
}) => {
  const { search: locationSearch } = useLocation();
  const urlParams = new URLSearchParams(locationSearch);

  const { before, after } = Object.fromEntries(urlParams);

  if (
    inactiveFilters &&
    inactiveFilters.includes(TxFiltersEnum.before) &&
    inactiveFilters.includes(TxFiltersEnum.after)
  ) {
    return null;
  }

  return (
    <OverlayTrigger
      trigger="click"
      key="popover"
      placement="bottom"
      rootClose
      overlay={
        <Popover id="popover-positioned-bottom" className="border bg-light">
          <Popover.Content className="p-0">
            <DateFilter />
          </Popover.Content>
        </Popover>
      }
    >
      <div className="d-inline-block side-action cursor-pointer" data-testid="StatusFilterButton">
        <FontAwesomeIcon
          icon={before !== undefined || after !== undefined ? faFilterSolid : faFilter}
          className={before !== undefined || after !== undefined ? 'text-primary' : ''}
        />
      </div>
    </OverlayTrigger>
  );
};
